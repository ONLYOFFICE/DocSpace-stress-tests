const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GlobEntries = require('webpack-glob-entries');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: Object.assign(
        GlobEntries('./FolderMy/*.ts'),
        { 'room': './Rooms/room.ts' }
    ), // Generates multiple entry for each test
    output: {
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'commonjs',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            // Replace the entire axios package with a synchronous k6/http adapter.
            // Axios v1.x uses async generators (for await, async function*) which
            // k6's goja runtime cannot parse. Our adapter has no async syntax.
            'axios': path.resolve(__dirname, 'k6-axios-adapter.ts'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    node: '22'
                                }
                            }],
                            "@babel/preset-typescript"
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread"
                        ]
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    target: 'web',
    externals: /^(k6|https?\:\/\/)(\/.*)?/,
    // Generate map files for compiled scripts
    devtool: "source-map",
    stats: {
        colors: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        // Copy assets to the destination folder
        // see `src/post-file-test.ts` for an test example using an asset
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'assets'),
                noErrorOnMissing: true
            }],
        }),
        new webpack.BannerPlugin({
            banner: `
// k6/http compatibility fix and request logging
const k6Http = require('k6/http');
if (k6Http && !k6Http.default) {
    k6Http.default = k6Http;

    // Wrap request to fix SDK body passing
    const originalRequest = k6Http.request;
    k6Http.default.request = function(method, url, body, params) {
      console.log(method);
      console.log(url);
      console.log(body);
      console.log(params);
        // SDK passes body in params.data, but k6 expects it as second parameter
        let actualBody = body;
        if (params && params.data) {
            actualBody = params.data;
            delete params.data;
        }
        return originalRequest(method, url, actualBody, params);
    };
}


// URL polyfill for k6
if (typeof URL === 'undefined') {
    global.URL = class URL {
        constructor(url, base) {
            if (base) {
                this.href = base + url;
                this.pathname = url;
                this._search = '';
            } else {
                this.href = url;
                const parts = url.split('?');
                this.pathname = parts[0];
                this._search = parts[1] ? '?' + parts[1] : '';
            }
            this.searchParams = new URLSearchParams(this._search);
            this.hash = '';
        }

        get search() {
            return this._search;
        }

        set search(value) {
            // Ensure search starts with ? if it has content
            if (value && !value.startsWith('?')) {
                value = '?' + value;
            }
            this._search = value;
            // Pass search without ? to URLSearchParams
            this.searchParams = new URLSearchParams(value);
        }

        toString() {
            // Update _search from searchParams
            const search = this.searchParams.toString();
            this._search = search ? '?' + search : '';
            return this.pathname + this._search;
        }
    };

    global.URLSearchParams = class URLSearchParams {
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
        has(key) {
            return this.params.hasOwnProperty(key);
        }
        delete(key) {
            delete this.params[key];
        }
        append(key, value) {
            if (this.has(key)) {
                const existing = this.params[key];
                if (Array.isArray(existing)) {
                    existing.push(value);
                } else {
                    this.params[key] = [existing, value];
                }
            } else {
                this.params[key] = value;
            }
        }
        toString() {
            const pairs = [];
            for (const key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    const value = this.params[key];
                    if (Array.isArray(value)) {
                        value.forEach(v => {
                            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
                        });
                    } else {
                        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                }
            }
            return pairs.join('&');
        }
    };
}
`,
            raw: true,
            entryOnly: true
        }),
    ],
    optimization: {
        // Don't minimize, as it's not used in the browser
        minimize: false,
    },
};