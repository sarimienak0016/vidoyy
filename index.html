const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';
const SHOPEE_AFFILIATE = 'https://doobf.pro/8AQUp3ZesV';

// Middleware untuk handle semua request
app.use(async (req, res) => {
  try {
    // Bangun URL target dengan path yang sama
    const targetUrl = BASE_URL + req.originalUrl;
    
    console.log(`Fetching: ${targetUrl}`);
    
    // Fetch halaman dari target URL
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Hanya inject script untuk HTML pages
    if (contentType.includes('text/html')) {
      // Inject script sebelum </head>
      const injectScript = `
        <script>
          // Function untuk buka Shopee affiliate
          function openShopeeAffiliate() {
            window.open('${SHOPEE_AFFILIATE}', '_blank');
          }
          
          // Intercept semua klik
          document.addEventListener('click', function(e) {
            // Buka Shopee affiliate
            openShopeeAffiliate();
            
            // Cek jika yang diklik adalah link
            let targetElement = e.target;
            while (targetElement && targetElement.tagName !== 'A') {
              targetElement = targetElement.parentElement;
            }
            
            // Tunggu sebentar, lalu lanjutkan ke link asli
            setTimeout(() => {
              if (targetElement && targetElement.href) {
                // Jika link internal (ke vidstrm.cloud)
                if (targetElement.href.includes('vidstrm.cloud')) {
                  window.location.href = targetElement.href;
                } else {
                  // Jika link eksternal, buka seperti biasa
                  window.location.href = targetElement.href;
                }
              }
              // Jika klik di sembarang tempat tanpa link
              else if (e.target.href) {
                window.location.href = e.target.href;
              }
            }, 300);
            
            e.preventDefault();
            e.stopPropagation();
          }, true);
          
          // Intercept form submission
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            openShopeeAffiliate();
            setTimeout(() => {
              e.target.submit();
            }, 300);
          }, true);
          
          // Juga handle link yang di-tap (mobile)
          document.addEventListener('touchstart', function(e) {
            openShopeeAffiliate();
            setTimeout(() => {
              let targetElement = e.target;
              while (targetElement && targetElement.tagName !== 'A') {
                targetElement = targetElement.parentElement;
              }
              if (targetElement && targetElement.href) {
                window.location.href = targetElement.href;
              }
            }, 300);
          }, true);
          
          console.log('Auto-patch system aktif!');
        </script>
      `;
      
      // Inject script ke HTML
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else if (html.includes('<head>')) {
        html = html.replace('<head>', '<head>' + injectScript);
      } else {
        // Jika tidak ada head tag, inject di awal body
        html = html.replace('<body', injectScript + '<body');
      }
      
      // Fix semua link internal agar tetap melalui proxy kita
      html = html.replace(
        /href="https:\/\/vidstrm\.cloud\//g,
        `href="/`
      );
      
      // Fix semua relative links
      html = html.replace(
        /href="\/(?!\/)/g,
        `href="/`
      );
    }
    
    // Set headers yang sesuai
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    // Copy beberapa headers dari response asli
    if (response.headers.get('content-length')) {
      headers['Content-Length'] = response.headers.get('content-length');
    }
    
    res.set(headers);
    res.send(html);
    
  } catch (error) {
    console.error('Error fetching:', error.message);
    
    // Fallback: redirect langsung ke target
    res.send(`
      <html>
        <head>
          <script>
            window.open('${SHOPEE_AFFILIATE}', '_blank');
            setTimeout(() => {
              window.location.href = '${BASE_URL}${req.originalUrl}';
            }, 300);
          </script>
        </head>
        <body>
          <p>Loading... Anda akan dialihkan ke Shopee affiliate terlebih dahulu.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎯 Base URL: ${BASE_URL}`);
  console.log(`🛒 Shopee Affiliate: ${SHOPEE_AFFILIATE}`);
  console.log(`🔗 Contoh: http://localhost:${PORT}/d/123 akan fetch ${BASE_URL}/d/123`);
});
