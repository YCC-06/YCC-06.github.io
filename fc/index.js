/**
 * 派蒙聊天 - 阿里云函数计算（FC）版代理
 *
 * 作用：把 DashScope 的 API Key 从前端移到服务端（与 Cloudflare Workers 版同理），
 *      前端只请求本函数。选择 FC 是因为 workers.dev 域名在国内网络下常被阻断，
 *      而 FC（阿里云）与 DashScope 同属国内，可直接访问。
 *
 * 部署：见同目录 README.md
 * 环境变量（函数配置 → 环境变量）：
 *   DASHSCOPE_API_KEY   必填，阿里云百炼 API Key
 *   ALLOWED_ORIGINS     可选，逗号分隔的允许来源；留空则允许所有来源
 *                       （本地 file:// 打开页面测试时 Origin 为 null，本代码已放行）
 *
 * 运行环境：Node.js 18 / 20（内置运行时）
 * 请求处理程序：index.handler
 * 触发器：HTTP 触发器（公网访问）
 */

const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// 简单的内存限流：每个 IP 每分钟最多 N 次请求
const RATE_LIMIT_PER_MINUTE = 30;
const rateLimitMap = new Map();

function parseAllowedOrigins() {
    const raw = process.env.ALLOWED_ORIGINS || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function isAllowedOrigin(origin, allowedOrigins) {
    if (allowedOrigins.length === 0) return true;
    // 放行本地测试：file:// 打开页面时浏览器不发送 Origin 或发送 null
    if (!origin || origin === 'null') return true;
    return allowedOrigins.includes(origin);
}

function corsHeaders(origin, allowedOrigins) {
    const allowed = isAllowedOrigin(origin, allowedOrigins);
    const allowOrigin = allowed ? (origin || '*') : 'null';
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
    };
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

function jsonResponse(statusCode, payload, headers = {}) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
        body: JSON.stringify(payload),
    };
}

// 解析 FC 传入的 event（Buffer 或字符串，HTTP 触发器为 JSON）
function parseEvent(event) {
    if (Buffer.isBuffer(event)) return JSON.parse(event.toString('utf8'));
    if (typeof event === 'string') return JSON.parse(event);
    return event;
}

exports.handler = async function (event, context) {
    // ---- 1. 解析请求 ----
    let req;
    try {
        req = parseEvent(event);
    } catch (e) {
        return jsonResponse(400, { error: '请求解析失败' });
    }

    const headers = req.headers || {};
    const method = (req.requestContext && req.requestContext.http && req.requestContext.http.method) || 'POST';
    const origin = headers['origin'] || headers['Origin'] || '';

    // ---- 2. CORS 预检 ----
    if (method === 'OPTIONS') {
        return { statusCode: 204, headers: corsHeaders(origin, parseAllowedOrigins()), body: '' };
    }

    if (method !== 'POST') {
        return jsonResponse(405, { error: '仅支持 POST 请求' }, corsHeaders(origin, parseAllowedOrigins()));
    }

    // ---- 3. 来源校验 ----
    const allowedOrigins = parseAllowedOrigins();
    if (!isAllowedOrigin(origin, allowedOrigins)) {
        return jsonResponse(403, { error: '来源不被允许' }, corsHeaders(origin, allowedOrigins));
    }

    // ---- 4. 密钥检查 ----
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
        return jsonResponse(500, { error: '服务端未配置 DASHSCOPE_API_KEY' }, corsHeaders(origin, allowedOrigins));
    }

    // ---- 5. 限流（按客户端 IP） ----
    const xff = headers['x-forwarded-for'] || '';
    const clientIp = (typeof xff === 'string' ? xff.split(',')[0] : '').trim() || 'unknown';
    if (!checkRateLimit(clientIp)) {
        return jsonResponse(429, { error: '请求过于频繁，请稍后再试' }, corsHeaders(origin, allowedOrigins));
    }

    // ---- 6. 解析并校验请求体 ----
    let body;
    try {
        let rawBody = req.body || '';
        if (req.isBase64Encoded) {
            rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
        }
        body = JSON.parse(rawBody);
    } catch (e) {
        return jsonResponse(400, { error: '请求体不是合法 JSON' }, corsHeaders(origin, allowedOrigins));
    }

    if (!body.messages || !Array.isArray(body.messages)) {
        return jsonResponse(400, { error: '缺少 messages 字段' }, corsHeaders(origin, allowedOrigins));
    }

    // ---- 7. 转发到 DashScope ----
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

        const text = await upstream.text();

        // 流式：透传 SSE 内容（前端按 SSE 逐行解析，功能兼容）
        if (body.stream) {
            return {
                statusCode: upstream.status,
                headers: {
                    'Content-Type': 'text/event-stream; charset=utf-8',
                    'Cache-Control': 'no-cache',
                    ...corsHeaders(origin, allowedOrigins),
                },
                body: text,
            };
        }

        // 非流式：透传 JSON
        return {
            statusCode: upstream.status,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                ...corsHeaders(origin, allowedOrigins),
            },
            body: text,
        };
    } catch (e) {
        return jsonResponse(502, { error: '上游请求失败：' + e.message }, corsHeaders(origin, allowedOrigins));
    }
};
