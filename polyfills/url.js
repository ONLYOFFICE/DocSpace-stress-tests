// Simple URL polyfill for k6
class URLPolyfill {
    constructor(url, base) {
        if (base) {
            // For relative URLs with base
            this.href = base + url;
            this.pathname = url;
            this.search = '';
            this.hash = '';
        } else {
            // For absolute URLs
            this.href = url;
            const parts = url.split('?');
            this.pathname = parts[0];
            this.search = parts[1] ? '?' + parts[1] : '';
            this.hash = '';
        }
        this.searchParams = new URLSearchParamsPolyfill(this.search);
    }

    toString() {
        return this.pathname + this.searchParams.toString();
    }
}

class URLSearchParamsPolyfill {
    constructor(search) {
        this.params = {};
        if (search && search.startsWith('?')) {
            search = search.substring(1);
        }
        if (search) {
            search.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) {
                    this.params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
                }
            });
        }
    }

    set(key, value) {
        this.params[key] = value;
    }

    get(key) {
        return this.params[key];
    }

    toString() {
        const pairs = [];
        for (const key in this.params) {
            if (this.params.hasOwnProperty(key)) {
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.params[key]));
            }
        }
        return pairs.length > 0 ? '?' + pairs.join('&') : '';
    }
}

if (typeof URL === 'undefined') {
    global.URL = URLPolyfill;
    global.URLSearchParams = URLSearchParamsPolyfill;
}

export { URLPolyfill as URL, URLSearchParamsPolyfill as URLSearchParams };