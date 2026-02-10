const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// DAFTAR DEEP LINK SHOPEE (ganti dengan link Anda)
const SHOPEE_DEEP_LINKS = [
  // Format: shopee://deeplink atau intent://
  'shopee://com.shopee.id',
  'intent://com.shopee.id#Intent;scheme=shopee;package=com.shopee.id;end;',
  'shope://com.shopee.id',
  'shopee-id://home',
  'https://shopee.co.id/m/'
];

// Link affiliate asli (untuk fallback)
const AFFILIATE_LINKS = [
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Function untuk generate Shopee deep link
function getShopeeDeepLink() {
  // Pilih random deep link
  return SHOPEE_DEEP_LINKS[Math.floor(Math.random() * SHOPEE_DEEP_LINKS.length)];
}

// Function untuk buka aplikasi dengan iframe method
function getAppOpenScript() {
  const deepLink = getShopeeDeepLink();
  const fallbackLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
  
  return `
    <script>
      // Function untuk buka aplikasi Shopee
      function openShopeeApp() {
        const deepLink = "${deepLink}";
        const fallbackUrl = "${fallbackLink}";
        let appOpened = false;
        
        console.log('Trying to open Shopee app...', deepLink);
        
        // METHOD 1: Pakai iframe untuk deep link (paling efektif)
        try {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.style.visibility = 'hidden';
          iframe.src = deepLink;
          document.body.appendChild(iframe);
          
          // Hapus iframe setelah 1 detik
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 1000);
        } catch(e) {
          console.log('Iframe method failed:', e);
        }
        
        // METHOD 2: Direct window.location
        setTimeout(() => {
          window.location.href = deepLink;
        }, 100);
        
        // METHOD 3: Coba scheme lain
        setTimeout(() => {
          if (deepLink.startsWith('shopee://')) {
            window.location.href = deepLink.replace('shopee://', 'shope://');
          }
        }, 200);
        
        // METHOD 4: Fallback ke affiliate link setelah 2 detik
        setTimeout(() => {
          console.log('Fallback to affiliate link');
          window.location.href = fallbackUrl;
        }, 2000);
        
        // Deteksi jika app terbuka (visibility change)
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            appOpened = true;
            console.log('✅ Shopee app opened successfully!');
          }
        });
        
        // Blur event juga bisa detect app open
        window.addEventListener('blur', function() {
          appOpened = true;
          console.log('✅ App opened (window blurred)');
        });
      }
      
      // AUTO OPEN SETELAH 3 DETIK
      let countdown = 3;
      let redirectTimer = setTimeout(() => {
        console.log('🔄 Auto-opening Shopee app...');
        openShopeeApp();
      }, 3000);
      
      // Update countdown display
      const countdownInterval = setInterval(() => {
        countdown--;
        const countdownEl = document.getElementById('countdown-timer');
        if (countdownEl) {
          countdownEl.textContent = countdown;
        }
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Reset timer pada user activity
      ['click', 'touchstart', 'mousemove', 'keydown'].forEach(event => {
        document.addEventListener(event, () => {
          clearTimeout(redirectTimer);
          clearInterval(countdownInterval);
          const notifyEl = document.getElementById('shopee-notify');
          if (notifyEl) notifyEl.style.display = 'none';
        }, { passive: true });
      });
      
      // Tangani klik user
      document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Buka aplikasi Shopee dulu
        openShopeeApp();
        
        // Cek jika klik link
        const link = e.target.closest('a');
        if (link && link.href) {
          // Redirect ke tujuan asli setelah 1.5 detik
          setTimeout(() => {
            window.location.href = link.href;
          }, 1500);
        }
        
        return false;
      }, true);
      
      console.log('📱 Shopee App Opener Ready!');
    </script>
  `;
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
      // Inject notification dan script
      const notificationHTML = `
        <div id="shopee-notify" style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #EE4D2D, #FF7337);
          color: white;
          padding: 15px;
          text-align: center;
          font-family: Arial, sans-serif;
          z-index: 999999;
          box-shadow: 0 2px 15px rgba(0,0,0,0.3);
          animation: slideDown 0.3s ease;
        ">
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span style="font-weight: bold; font-size: 16px;">⏰ Buka Aplikasi Shopee dalam</span>
            <span id="countdown-timer" style="
              background: white;
              color: #EE4D2D;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 18px;
              min-width: 40px;
              display: inline-block;
            ">3</span>
            <span style="font-weight: bold; font-size: 16px;">detik</span>
            <button onclick="document.getElementById('shopee-notify').style.display='none';" style="
              background: rgba(255,255,255,0.2);
              border: 2px solid white;
              color: white;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              margin-left: 15px;
              cursor: pointer;
            ">Batal</button>
          </div>
        </div>
        
        <style>
          @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
          body { padding-top: 60px !important; }
        </style>
      `;
      
      // Inject notification
      if (html.includes('<body')) {
        html = html.replace('<body', '<body>' + notificationHTML);
      } else {
        html = notificationHTML + html;
      }
      
      // Inject script
      const appScript = getAppOpenScript();
      if (html.includes('</head>')) {
        html = html.replace('</head>', appScript + '</head>');
      } else {
        html = appScript + html;
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
    // Auto redirect ke Shopee deep link jika error
    const deepLink = getShopeeDeepLink();
    res.send(`
      <html>
        <head>
          <script>
            // Redirect langsung ke Shopee app
            window.location.href = "${deepLink}";
            // Fallback setelah 1 detik
            setTimeout(() => {
              window.location.href = "${AFFILIATE_LINKS[0]}";
            }, 1000);
          </script>
        </head>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`📱 Server Shopee App Opener`);
  console.log(`👉 Akan buka APLIKASI Shopee, bukan browser`);
  console.log(`⏰ Auto-trigger: 3 detik`);
});
