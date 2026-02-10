const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';
const SHOPEE_AFFILIATE = 'https://doobf.pro/8AQUp3ZesV';

// Middleware untuk handle semua request
app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.originalUrl;
    console.log(`Fetching: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      return res.redirect(targetUrl);
    }
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('text/html')) {
      // SCRIPT YANG LEBIH CEPAT - NO DELAY
      const injectScript = `
        <script>
          // Simpan referrer asli
          const originalReferrer = document.referrer;
          let shopeeOpened = false;
          
          // Function untuk buka Shopee affiliate (hanya sekali)
          function openShopeeOnce() {
            if (!shopeeOpened) {
              shopeeOpened = true;
              // Buka di background tab (tidak mengganggu user)
              const shopeeWindow = window.open('${SHOPEE_AFFILIATE}', '_blank');
              if (shopeeWindow) {
                shopeeWindow.blur();
                window.focus();
              }
            }
          }
          
          // Buka Shopee affiliate saat page load (tanpa delay)
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(openShopeeOnce, 50); // Sangat cepat
          });
          
          // Juga buka saat user mulai interaksi
          document.addEventListener('mousemove', openShopeeOnce, { once: true });
          document.addEventListener('touchstart', openShopeeOnce, { once: true });
          document.addEventListener('click', openShopeeOnce, { once: true });
          
          // Tangani klik dengan INSTANT redirect
          document.addEventListener('click', function(e) {
            // Cari element <a> terdekat
            let targetElement = e.target;
            while (targetElement && targetElement.tagName !== 'A') {
              targetElement = targetElement.parentElement;
            }
            
            // Jika ini link, redirect INSTANT
            if (targetElement && targetElement.href) {
              // Pastikan Shopee sudah terbuka
              openShopeeOnce();
              
              // Tunda sedikit (10ms) untuk pastikan popup terbuka
              e.preventDefault();
              e.stopPropagation();
              
              setTimeout(() => {
                window.location.href = targetElement.href;
              }, 10); // HANYA 10ms!
            }
          }, true);
          
          // Handle semua link untuk tetap di proxy kita
          document.addEventListener('DOMContentLoaded', function() {
            // Rewrite semua link internal
            document.querySelectorAll('a[href*="vidstrm.cloud"]').forEach(link => {
              const url = new URL(link.href);
              link.href = url.pathname + url.search;
            });
          });
          
          console.log('Fast redirect system aktif!');
        </script>
      `;
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else {
        html = html.replace('<body', injectScript + '<body');
      }
      
      // Rewrite semua link di server side juga
      html = html.replace(
        /(href|src|action)=["'](https?:)?\/\/vidstrm\.cloud(\/[^"']*)["']/gi,
        (match, attr, protocol, path) => {
          return `${attr}="${path}"`;
        }
      );
      
      // Rewrite relative paths
      html = html.replace(
        /(href|src|action)=["'](\/[^"'][^"']*)["']/gi,
        (match, attr, path) => {
          if (!path.startsWith('//') && !path.includes('://')) {
            return `${attr}="${path}"`;
          }
          return match;
        }
      );
    }
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    }).send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback langsung redirect dengan Shopee
    res.send(`
      <html>
        <head>
          <script>
            // Buka Shopee segera
            const w = window.open('${SHOPEE_AFFILIATE}', '_blank');
            if (w) w.blur();
            // Redirect langsung ke target
            window.location.href = '${BASE_URL}${req.originalUrl}';
          </script>
        </head>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server FAST running on port ${PORT}`);
});
