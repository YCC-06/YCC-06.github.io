/**
 * 派蒙聊天 - 阿里云百炼 API 代理
 *
 * 作用：把 DashScope 的 API Key 从浏览器端移到服务端，
 *      前端只请求本 Worker，Key 存在 Worker 的环境变量里，不对外泄露。
 *
 * 部署：见同目录 README.md
 * 环境变量（wrangler secret / dashboard）：
 *   DASHSCOPE_API_KEY   必填，阿里云百炼 API Key
 *   ALLOWED_ORIGINS     可选，逗号分隔的允许来源，默认允许所有（个人站建议设置）
 */

// 允许跨域请求的前端来源；留空则允许所有来源
const ALLOWED_ORIGINS = (typeof ALLOWED_ORIGINS_ENV !== 'undefined' && ALLOWED_ORIGINS_ENV)
    ? ALLOWED_ORIGINS_ENV.split(',').map(s => s.trim()).filter(Boolean)
    : [];

// DashScope OpenAI 兼容接口
const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// 简单的内存限流：每个 IP 每分钟最多 N 次请求
// （注意：内存限流只在单个 Worker 实例内有效，严格的全局限流建议用 Cloudflare 的 Rate Limiting 规则）
const RATE_LIMIT_PER_MINUTE = 30;
const rateLimitMap = new Map();

function corsHeaders(origin) {
    const allowed = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
    const allowOrigin = allowed ? (origin || '*') : 'null';
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
    };
}

function isAllowedOrigin(origin) {
    if (ALLOWED_ORIGINS.length === 0) return true;
    return !!origin && ALLOWED_ORIGINS.includes(origin);
}

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - 60000;
    const records = rateLimitMap.get(ip) || [];
    const recent = records.filter(t => t > windowStart);
    if (recent.length >= RATE_LIMIT_PER_MINUTE) {
        rateLimitMap.set(ip, recent);
        return false;
    }
    recent.push(now);
    rateLimitMap.set(ip, recent);
    return true;
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';

        // CORS 预检
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: '仅支持 POST 请求' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        // 来源校验
        if (!isAllowedOrigin(origin)) {
            return new Response(JSON.stringify({ error: '来源不被允许' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        const apiKey = env.DASHSCOPE_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: '服务端未配置 DASHSCOPE_API_KEY' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        // 简单限流（按客户端 IP）
        const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (!checkRateLimit(clientIp)) {
            return new Response(JSON.stringify({ error: '请求过于频繁，请稍后再试' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        // 解析并校验请求体
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: '请求体不是合法 JSON' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        if (!body.messages || !Array.isArray(body.messages)) {
            return new Response(JSON.stringify({ error: '缺少 messages 字段' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }

        // 转发到 DashScope，Key 只存在于服务端
        try {
            const upstream = await fetch(DASHSCOPE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: body.model || 'qwen3.7-flash',
                    messages: body.messages,
                    temperature: body.temperature ?? 0.8,
                    stream: body.stream ?? false,
                    enable_search: body.enable_search ?? false,
                }),
            });

            // 流式响应：原样透传 SSE
            if (body.stream) {
                return new Response(upstream.body, {
                    status: upstream.status,
                    headers: {
                        'Content-Type': 'text/event-stream; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        ...corsHeaders(origin),
                    },
                });
            }

            // 非流式：透传 JSON
            const text = await upstream.text();
            return new Response(text, {
                status: upstream.status,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...corsHeaders(origin),
                },
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: '上游请求失败：' + e.message }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }
    },
};
