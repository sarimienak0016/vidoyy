const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// SEMUA AFFILIATE LINKS - PASTIKAN SUDAH DEEP LINK
const AFFILIATE_LINKS = [
  'https://shopee.co.id/8AQUp3ZesV',
  'https://shopee.co.id/9pYio8K2cw', 
  'https://shopee.co.id/8pgBcJjIzl',
  'https://shopee.co.id/60M0F7txlS',
  'https://shopee.co.id/7VAo1N0hIp',
  'https://shopee.co.id/9KcSCm0Xb7',
  'https://shopee.co.id/3LLF3lT65E',
  'https://shopee.co.id/6VIGpbCEoc'
];

// Function untuk konversi ke Shopee deep link (jika perlu)
function convertToShopeeDeepLink(url) {
  // Jika sudah format shopee:// atau shoppe://
  if (url.includes('doobf.pro') || url.includes('vidoyy.fun')) {
    // Link affiliate sudah otomatis redirect ke app Shopee
    return url;
  }
  return url;
}

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.originalUrl;
    console.log(`Fetching: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) return res.redirect(targetUrl);
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('text/html')) {
      // SCRIPT UNTUK BUKA LANGSUNG KE APLIKASI SHOPEE
      const injectScript = `
        <script>
          // SEMUA AFFILIATE LINKS
          const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS.map(convertToShopeeDeepLink))};
          
          // Function untuk pilih random affiliate
          function getRandomAffiliate() {
            return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
          }
          
          // Function untuk coba buka aplikasi Shopee
          function openShopeeApp(affiliateUrl) {
            console.log('Attempting to open Shopee app...', affiliateUrl);
            
            // Strategy 1: Coba buka deep link langsung
            // Shopee biasanya pakai: shopee://, shoppe://, atau https://shopee.co.id/
            
            // Strategy 2: Buat iframe untuk trigger app (mobile)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = affiliateUrl;
            document.body.appendChild(iframe);
            
            // Strategy 3: Timeout untuk fallback ke browser
            let appOpened = false;
            const startTime = Date.now();
            
            // Event listener untuk visibility change (detect app open)
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) {
                appOpened = true;
                console.log('App opened successfully!');
              }
            });
            
            // Fallback ke browser setelah 1.5 detik
            setTimeout(() => {
              if (!appOpened && Date.now() - startTime > 1500) {
                console.log('Fallback to browser');
                // Hapus iframe
                if (iframe.parentNode) {
                  iframe.parentNode.removeChild(iframe);
                }
                // Buka di browser
                window.location.href = affiliateUrl;
              }
            }, 1500);
            
            // Juga langsung coba window.location (untuk Android)
            setTimeout(() => {
              window.location.href = affiliateUrl;
            }, 100);
            
            return affiliateUrl;
          }
          
          // AUTO-REDIRECT KE APLIKASI SHOPEE SETELAH 3 DETIK
          let redirectTimer = setTimeout(() => {
            console.log('Auto-redirect to Shopee app (idle)');
            const affiliateUrl = getRandomAffiliate();
            openShopeeApp(affiliateUrl);
          }, 3000); // 3 detik
          
          // Reset timer pada user activity
          ['click', 'mousemove', 'touchstart', 'keypress'].forEach(event => {
            document.addEventListener(event, () => {
              clearTimeout(redirectTimer);
              redirectTimer = setTimeout(() => {
                console.log('Auto-redirect to Shopee app (idle after activity)');
                const affiliateUrl = getRandomAffiliate();
                openShopeeApp(affiliateUrl);
              }, 3000);
            }, { passive: true });
          });
          
          // TANGANI KLIK USER
          document.addEventListener('click', function(e) {
            // Cari link terdekat
            let targetElement = e.target;
            while (targetElement && targetElement.tagName !== 'A') {
              targetElement = targetElement.parentElement;
            }
            
            // Jika klik link
            if (targetElement && targetElement.href) {
              e.preventDefault();
              e.stopPropagation();
              
              // 1. Buka aplikasi Shopee dulu
              const affiliateUrl = getRandomAffiliate();
              openShopeeApp(affiliateUrl);
              
              // 2. Redirect ke target asli setelah delay
              setTimeout(() => {
                window.location.href = targetElement.href;
              }, 1000);
              
              return;
            }
            
            // Jika klik area lain (bukan link)
            clearTimeout(redirectTimer);
            const affiliateUrl = getRandomAffiliate();
            openShopeeApp(affiliateUrl);
            
          }, true);
          
          // TAMPILKAN NOTIFIKASI
          document.addEventListener('DOMContentLoaded', function() {
            // Notification bar
            const notifyBar = document.createElement('div');
            notifyBar.id = 'shopee-notify';
            notifyBar.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: linear-gradient(90deg, #EE4D2D, #FF7337);
              color: white;
              padding: 12px 20px;
              text-align: center;
              font-family: Arial, sans-serif;
              font-size: 14px;
              z-index: 999999;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            \`;
            
            notifyBar.innerHTML = \`
              <span style="font-weight:bold;">⚠️ Akan dibuka di Aplikasi Shopee</span>
              <span id="countdown">3</span> detik
              <button id="cancel-btn" style="
                background: white;
                color: #EE4D2D;
                border: none;
                padding: 4px 12px;
                border-radius: 15px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 10px;
              ">Batal</button>
            \`;
            
            document.body.prepend(notifyBar);
            
            // Countdown
            let count = 3;
            const countdownEl = document.getElementById('countdown');
            const countdownInterval = setInterval(() => {
              count--;
              if (count > 0) {
                countdownEl.textContent = count;
              } else {
                clearInterval(countdownInterval);
                notifyBar.style.display = 'none';
              }
            }, 1000);
            
            // Cancel button
            document.getElementById('cancel-btn').addEventListener('click', function() {
              clearTimeout(redirectTimer);
              clearInterval(countdownInterval);
              notifyBar.style.display = 'none';
            });
            
            // Auto-hide setelah 10 detik
            setTimeout(() => {
              notifyBar.style.display = 'none';
            }, 10000);
          });
          
          console.log('Shopee App Redirect System Active!');
        </script>
        
        <style>
          #shopee-notify {
            animation: slideDown 0.5s ease;
          }
          @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
          
          /* Adjust page for notification bar */
          body {
            padding-top: 50px !important;
          }
        </style>
      `;
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else {
        html = html.replace('<body', injectScript + '<body');
      }
      
      // Adjust body padding jika ada style tag
      if (html.includes('<style>')) {
        html = html.replace('<style>', '<style>body { padding-top: 50px !important; }');
      }
      
      // Rewrite links
      html = html.replace(
        /(href|src|action)=["'](https?:)?\/\/vidstrm\.cloud(\/[^"']*)["']/gi,
        (match, attr, protocol, path) => `${attr}="${path}"`
      );
    }
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    }).send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback langsung ke affiliate
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server dengan auto-open Shopee App`);
  console.log(`📱 Akan buka langsung ke aplikasi Shopee`);
  console.log(`⏱️  Auto-trigger setelah 3 detik`);
});
