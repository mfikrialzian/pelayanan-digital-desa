const fs = require('fs');

let html = fs.readFileSync('src/index.html', 'utf8');

// Replace GAS includes with static assets
html = html.replace(/<\?!= include\('style'\); \?>/g, '<link rel="stylesheet" href="style.css">');
html = html.replace(/<\?!= include\('script_core'\); \?>/g, '<script src="script_core.js"></script>');
html = html.replace(/<\?!= include\('script_admin'\); \?>/g, '<script src="script_admin.js"></script>');
html = html.replace(/<\?!= include\('script_warga'\); \?>/g, '<script src="script_warga.js"></script>');
html = html.replace(/<\?!= include\('script_utils'\); \?>/g, '<script src="script_utils.js"></script>');

// Inject Polyfill inside <head>
const polyfill = `
    <!-- VERCEL-GAS HYBRID POLYFILL -->
    <script>
        const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzmjoh971LrqxxkiLE3D4TI-USB4efSVQ5jWMxLlBPj_2UATy-bM7Lam_QmzUoHzQuj/exec"; // Ganti dengan URL Deploy Anda

        window.google = window.google || {};
        window.google.script = window.google.script || {};

        Object.defineProperty(window.google.script, 'run', {
            get: function() {
                let successHandler = null;
                let failureHandler = null;
                
                const handlerProxy = new Proxy({}, {
                    get: function(target, prop) {
                        if (prop === 'withSuccessHandler') {
                            return function(callback) {
                                successHandler = callback;
                                return handlerProxy;
                            };
                        }
                        if (prop === 'withFailureHandler') {
                            return function(callback) {
                                failureHandler = callback;
                                return handlerProxy;
                            };
                        }
                        
                        return function(...args) {
                            fetch(GAS_API_URL, {
                                method: "POST",
                                body: JSON.stringify({ action: prop, params: args }),
                                headers: { "Content-Type": "text/plain;charset=utf-8" },
                                redirect: "follow"
                            })
                            .then(r => r.json())
                            .then(res => {
                                if (res.success && successHandler) successHandler(res.data);
                                else if (!res.success && failureHandler) failureHandler(res.error);
                                else if (!res.success && !failureHandler) console.error("GAS Error:", res.error);
                            })
                            .catch(err => {
                                if (failureHandler) failureHandler(err);
                                else console.error("Network Error:", err);
                            });
                        };
                    }
                });
                return handlerProxy;
            }
        });
    </script>
`;

// Insert just before </head>
html = html.replace('</head>', polyfill + '\n</head>');

// Strip out any remaining GAS tags if any (like <?= pageParam ?>)
// We will replace pageParam with a default empty string for static rendering.
html = html.replace(/<\?= pageParam \?>/g, '');

fs.writeFileSync('vercel-frontend/index.html', html);
console.log("index.html built successfully.");
