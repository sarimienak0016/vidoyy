const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

const AFFILIATE_LINKS = [
  'https://s.shopee.co.id/4qA9Bh0rNF',
  'https://s.shopee.co.id/8V3RYSQETG', 
  'https://s.shopee.co.id/9KcXC4pyuT',
  'https://s.shopee.co.id/9pYnn0fM8L', 
  'https://s.shopee.co.id/9pYnn0fM8L',
  'https://s.shopee.co.id/8pgBcJjIzl',
  'https://s.shopee.co.id/60M0F7txlS',
  'https://s.shopee.co.id/6AfWmBq6UQ',
  'https://s.shopee.co.id/7AY3y2lgdw',
  'https://s.shopee.co.id/8zzi9Qj2xa',
  'https://s.shopee.co.id/6pvDZSqkme',
  'https://s.shopee.co.id/4VXInCPYuK',
  'https://s.shopee.co.id/5q2gNfRMx8'
];

const SHOPEE_DEEP_LINKS = [
  'intent://main#Intent;package=com.shopee.id;scheme=shopee;end',
  'intent://main#Intent;package=com.shopee.id;action=android.intent.action.VIEW;scheme=shopee;end',
  'shopee://',
  'shopee.co.id://',
  'com.shopee.id://'
];

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.url;
    const currentPath = req.url;
    
    const response = await fetch(targetUrl);
    let html = await response.text();
    
    // Cek apakah ini file asset (css, js, gambar)
    const isAsset = req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp4|webm|ogg)$/i);
    
    if (isAsset) {
      // Untuk asset, proxy dari videy.co
      html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
      html = html.replace(/src="https:\/\/vidstrm\.cloud\//g, 'src="/');
      return res.set('Content-Type', 'text/html').send(html);
    }
    
    // LANDING PAGE LENGKAP - SEMUA HALAMAN HTML KENA INI
    const landingPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Stream</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          height: 100vh;
          overflow: hidden;
        }
        
        #redirect-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          text-align: center;
          padding: 20px;
          cursor: pointer;
        }
        
        .click-box {
          background: #EE4D2D;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          margin: 30px 0;
          transition: transform 0.2s;
          pointer-events: none;
        }
        
        .telegram-button {
          background: #0088cc;
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.2s, background 0.2s;
          cursor: pointer;
          border: none;
          z-index: 1000000;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,136,204,0.3);
          pointer-events: auto;
        }
        
        .telegram-button:hover {
          background: #006699;
          transform: scale(1.05);
        }
        
        .instruction {
          font-size: 18px;
          margin-top: 20px;
          opacity: 0.9;
          pointer-events: none;
        }
        
        h1 {
          pointer-events: none;
        }
        
        #redirect-overlay:hover .click-box {
          transform: scale(1.05);
        }
        
        #redirect-overlay:active {
          background: rgba(0, 0, 0, 0.90);
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(238, 77, 45, 0); }
          100% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0); }
        }
        
        .click-box {
          animation: pulse 2s infinite;
        }
        
        .button-container {
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div id="redirect-overlay">
        <h1>🎬 Video Player</h1>
        <div class="click-box">
          KLIK DIMANAPUN UNTUK PLAY VIDEO
        </div>
        <div class="button-container">
          <button class="telegram-button" id="telegramButton" onclick="event.stopPropagation(); window.location.href='https://t.me/sedot6969'; return false;">
            📱 JOIN TELE
          </button>
        </div>
        <div class="instruction">
          Klik di area manapun<br>
          <small>Lanjut ke video</small>
        </div>
      </div>

      <script>
        // DEEP LINKS untuk buka APLIKASI Shopee (ACAK)
        const SHOPEE_DEEP_LINKS = ${JSON.stringify(SHOPEE_DEEP_LINKS)};
        
        // AFFILIATE LINKS untuk fallback (ACAK)
        const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
        
        const BASE_URL = '${BASE_URL}';
        const CURRENT_PATH = '${currentPath}';
        let hasClicked = false;
        
        // Fungsi untuk ambil link ACAK
        function getRandomAffiliateLink() {
          return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
        }
        
        // Fungsi buka aplikasi Shopee
        function openShopeeApp() {
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          const isAndroid = /Android/i.test(navigator.userAgent);
          
          if (!isMobile) {
            const shopeeUrl = getRandomAffiliateLink();
            window.open(shopeeUrl, '_blank');
            return;
          }
          
          if (isAndroid) {
            try {
              // Intent untuk Android
              window.location.href = 'intent://main#Intent;package=com.shopee.id;scheme=shopee;end';
              setTimeout(() => {
                if (!hasClicked) {
                  window.location.href = getRandomAffiliateLink();
                }
              }, 2000);
            } catch (e) {
              window.location.href = getRandomAffiliateLink();
            }
          } else {
            // iOS
            window.location.href = 'shopee://';
            setTimeout(() => {
              if (!hasClicked) {
                window.location.href = getRandomAffiliateLink();
              }
            }, 2000);
          }
        }
        
        function handleClick(e) {
          // Cek apakah yang diklik adalah tombol Telegram atau anaknya
          if (e.target.closest && e.target.closest('#telegramButton')) {
            return; // Jangan proses untuk tombol Telegram
          }
          
          if (hasClicked) return;
          hasClicked = true;
          
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          if (isMobile) {
            openShopeeApp();
          } else {
            // Desktop - buka link afiliasi di tab baru
            const shopeeUrl = getRandomAffiliateLink();
            window.open(shopeeUrl, '_blank');
            
            // Redirect ke halaman asli setelah beberapa saat
            setTimeout(() => {
              window.location.href = BASE_URL + CURRENT_PATH;
            }, 500);
          }
        }
        
        // Handler khusus untuk tombol Telegram
        function handleTelegramClick(e) {
          e.stopPropagation(); // Mencegah event bubbling
          e.preventDefault();
          
          // Buka Telegram di tab yang SAMA (ga kena blokir popup)
          window.location.href = 'https://t.me/sedot6969';
          
          return false;
        }
        
        // Pasang event listener
        const overlay = document.getElementById('redirect-overlay');
        const telegramBtn = document.getElementById('telegramButton');
        
        // Event untuk overlay (selain tombol Telegram)
        overlay.addEventListener('click', handleClick);
        
        // Event untuk touch device
        overlay.addEventListener('touchstart', function(e) {
          // Cek apakah yang disentuh adalah tombol Telegram
          if (e.target.closest && e.target.closest('#telegramButton')) {
            return;
          }
          e.preventDefault();
          handleClick(e);
        });
        
        // Event khusus untuk tombol Telegram
        telegramBtn.addEventListener('click', handleTelegramClick);
        telegramBtn.addEventListener('touchstart', function(e) {
          e.stopPropagation();
          e.preventDefault();
          window.location.href = 'https://t.me/sedot6969';
        });
        
        // Keyboard support
        document.addEventListener('keydown', function(e) {
          if ((e.code === 'Space' || e.code === 'Enter') && !hasClicked) {
            e.preventDefault();
            handleClick(e);
          }
        });
        
        console.log('Siap: Klik di mana saja (kecuali tombol JOIN TELE) untuk buka Shopee');
      </script>
    </body>
    </html>
    `;
    
    // KIRIM LANDING PAGE UNTUK SEMUA HALAMAN HTML
    return res.set('Content-Type', 'text/html').send(landingPage);
    
  } catch (error) {
    console.error('Error:', error);
    // Jika error, redirect langsung ke Shopee
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    return res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Mode: SEMUA halaman kena landing page`);
  console.log(`Redirect: Klik → Shopee → ${BASE_URL}`);
});
