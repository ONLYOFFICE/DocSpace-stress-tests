/**
 * Synchronous Axios-compatible adapter for k6.
 * Replaces the `axios` npm package so that SDK HTTP calls go through k6/http
 * instead of Node.js/browser fetch — which uses async generators unsupported by k6.
 *
 * Adapted from the Playwright adapter used in API/UI tests.
 */

import http from 'k6/http';

interface RequestConfig {
    method?: string;
    url?: string;
    baseURL?: string;
    params?: Record<string, any>;
    headers?: Record<string, any>;
    data?: any;
}

interface AxiosLikeResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: RequestConfig;
}

function request(config: RequestConfig): AxiosLikeResponse {
    const method = (config.method || 'GET').toUpperCase();

    let url = config.url || '';
    if (config.baseURL && !url.startsWith('http')) {
        url = config.baseURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
    }

    if (config.params && Object.keys(config.params).length > 0) {
        const qs = Object.keys(config.params)
            .filter(k => config.params![k] != null)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(config.params![k]))
            .join('&');
        if (qs) url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
    }

    // Flatten headers — the SDK passes them as a plain object
    const headers: Record<string, string> = {};
    if (config.headers && typeof config.headers === 'object') {
        for (const key of Object.keys(config.headers)) {
            const val = config.headers[key];
            if (typeof val === 'string') {
                headers[key] = val;
            }
        }
    }

    // Prepare body — SDK already JSON-serialises objects via serializeDataIfNeeded
    let body: string | null = null;
    if (config.data != null) {
        body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
    }

    const res = http.request(method, url, body, { headers });

    let responseData: unknown;
    try {
        responseData = res.json() as unknown;
    } catch (_) {
        responseData = res.body;
    }

    return {
        data: responseData,
        status: res.status,
        statusText: String(res.status),
        headers: res.headers as Record<string, string>,
        config,
    };
}

const k6Adapter = {
    defaults: { baseURL: '' },
    request,
};

export default k6Adapter;
