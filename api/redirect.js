export default function handler(req, res) {
  const targetUrl = "https://vidstrm.cloud/d/";
  const affiliateUrl = "https://doobf.pro/8AQUp3ZesV";
  const shopeeAffiliate = "https://doobf.pro/8AQUp3ZesV";
  
  // Jika ada path tambahan
  const path = req.query.path || '';
  const fullTargetUrl = targetUrl + (path ? path + (req.url.includes('?') ? req.url.split('?')[1] : '') : '');
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
        let clicked = false;
        let redirectTimer;
        let autoRedirectTimer;
        
        // Fungsi untuk redirect ke Shopee affiliate
        function redirectToShopee() {
            if (!clicked) {
                clicked = true;
                clearTimeout(autoRedirectTimer);
                window.location.href = "${shopeeAffiliate}";
            }
        }
        
        // Fungsi untuk redirect ke URL target setelah beberapa saat
        function autoRedirectToTarget() {
            window.location.href = "${fullTargetUrl}";
        }
        
        // Event listener untuk klik di mana saja
        document.addEventListener('DOMContentLoaded', function() {
            // Jika ada klik di mana saja dalam 3 detik pertama, arahkan ke Shopee
            document.body.addEventListener('click', function(e) {
                if (!clicked && Date.now() - pageLoadTime < 3000) {
                    redirectToShopee();
                }
            });
            
            // Auto redirect ke Shopee setelah 3 detik jika tidak diklik
            autoRedirectTimer = setTimeout(function() {
                if (!clicked) {
                    window.location.href = "${affiliateUrl}";
                }
            }, 3000);
            
            // Auto redirect ke target setelah 5 detik
            redirectTimer = setTimeout(autoRedirectToTarget, 5000);
        });
        
        const pageLoadTime = Date.now();
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            cursor: pointer;
        }
        
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: transparent;
        }
    </style>
</head>
<body>
    <!-- Overlay transparan untuk menangkap klik -->
    <div class="overlay" onclick="redirectToShopee()"></div>
    
    <!-- Iframe dengan konten asli -->
    <iframe 
        src="${fullTargetUrl}" 
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="fullscreen"
        id="contentFrame"
    ></iframe>
    
    <script>
        // Juga tangkap klik di iframe
        document.getElementById('contentFrame').onload = function() {
            try {
                this.contentDocument.body.addEventListener('click', function() {
                    if (!clicked && Date.now() - pageLoadTime < 3000) {
                        redirectToShopee();
                    }
                });
            } catch(e) {
                // Jika ada error CORS, tangani secara berbeda
                this.onclick = function() {
                    if (!clicked && Date.now() - pageLoadTime < 3000) {
                        redirectToShopee();
                    }
                };
            }
        };
    </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
