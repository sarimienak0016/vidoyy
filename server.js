const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// LINK SHOPEE AFFILIATE
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
      // Untuk asset, proxy dari vidstrm.cloud
      html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
      html = html.replace(/src="https:\/\/vidstrm\.cloud\//g, 'src="/');
      return res.set('Content-Type', 'text/html').send(html);
    }
    
    // LANDING PAGE DENGAN ALUR YANG DIMINTA:
    // 1. Klik JOIN TELE → buka grup Telegram
    // 2. Klik BACK → balik ke landing page
    // 3. Klik area manapun → buka Shopee di tab baru
    // 4. Landing page redirect ke BASE_URL (video)
    // 5. Klik BACK dari Shopee → balik ke BASE_URL (video)
    
    const landingPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <!-- META TAGS UNTUK TWITTER/FACEBOOK -->
      <meta property="og:title" content="🎬 Video Player Streaming">
      <meta property="og:description" content="Klik untuk memutar video streaming gratis">
      <meta property="og:image" content="https://via.placeholder.com/1200x630/FF1493/ffffff?text=Video+Player">
      <meta property="og:url" content="${BASE_URL}${currentPath}">
      <meta property="og:type" content="website">
      
      <!-- TWITTER CARD -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="🎬 Video Player Streaming">
      <meta name="twitter:description" content="Klik untuk memutar video streaming gratis">
      <meta name="twitter:image" content="https://via.placeholder.com/1200x630/FF1493/ffffff?text=Video+Player">
      
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
        
        .content-wrapper {
          pointer-events: none;
        }
        
        .click-box {
          background: #FF1493;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          margin: 30px 0;
          transition: transform 0.2s;
          animation: pulse 2s infinite;
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
        }
        
        h1 {
          margin-bottom: 20px;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,20,147,0.7); }
          70% { box-shadow: 0 0 0 20px rgba(255,20,147,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,20,147,0); }
        }
      </style>
    </head>
    <body>
      <div id="redirect-overlay">
        <div class="content-wrapper">
          <h1>🎬 Video Player</h1>
          
          <div class="click-box">
            KLIK DIMANAPUN UNTUK PLAY VIDEO
          </div>
          
          <!-- TOMBOL TELEGRAM - PAKAI LINK LANGSUNG -->
          <a href="https://t.me/viddayvid" target="_blank" class="telegram-button" id="telegramButton" onclick="event.stopPropagation();">
            📱 JOIN TELE
          </a>
          
          <div class="instruction">
            Klik di area manapun untuk play video<br>
            <small>Klik tombol biru untuk join grup Telegram</small>
          </div>
        </div>
      </div>

      <script>
        // LINK SHOPEE AFFILIATE
        const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
        const BASE_URL = '${BASE_URL}';
        const CURRENT_PATH = '${currentPath}';
        let hasClicked = false;
        
        function getRandomAffiliateLink() {
          return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
        }
        
        // FUNGSI UNTUK BUKA SHOPEE
        function handleShopeeClick() {
          if (hasClicked) return;
          hasClicked = true;
          
          const shopeeUrl = getRandomAffiliateLink();
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          // Ubah tampilan
          document.querySelector('.click-box').innerText = '⏳ LOADING...';
          
          if (isMobile) {
            // Coba buka app Shopee
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'shopee://';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
              
              // Buka Shopee di tab baru
              window.open(shopeeUrl, '_blank');
              
              // REDIRECT HALAMAN INI KE BASE_URL (VIDEO)
              setTimeout(() => {
                window.location.href = BASE_URL + CURRENT_PATH;
              }, 500);
            }, 500);
          } else {
            // Desktop: buka Shopee di tab baru
            window.open(shopeeUrl, '_blank');
            
            // REDIRECT HALAMAN INI KE BASE_URL (VIDEO)
            setTimeout(() => {
              window.location.href = BASE_URL + CURRENT_PATH;
            }, 500);
          }
        }
        
        // EVENT LISTENERS
        const overlay = document.getElementById('redirect-overlay');
        const telegramButton = document.getElementById('telegramButton');
        
        overlay.addEventListener('click', function(e) {
          // Klik tombol Telegram? Jangan buka Shopee
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return;
          }
          handleShopeeClick();
        });
        
        overlay.addEventListener('touchstart', function(e) {
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return;
          }
          e.preventDefault();
          handleShopeeClick();
        });
        
        // Auto redirect 10 detik
        setTimeout(() => {
          if (!hasClicked) handleShopeeClick();
        }, 10000);
        
        // Reset kalau back ke halaman
        window.addEventListener('pageshow', function(event) {
          if (event.persisted) {
            hasClicked = false;
          }
        });
      </script>
    </body>
    </html>
    `;
    
    // KIRIM LANDING PAGE
    return res.set('Content-Type', 'text/html').send(landingPage);
    
  } catch (error) {
    console.error('Error:', error);
    // Error: redirect langsung ke Shopee
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    return res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`📱 Alur:`);
  console.log(`   1. Klik JOIN TELE → buka grup Telegram`);
  console.log(`   2. Klik BACK → balik ke landing page`);
  console.log(`   3. Klik area manapun → buka Shopee + redirect ke ${BASE_URL}`);
  console.log(`   4. Klik BACK dari Shopee → balik ke ${BASE_URL}`);
});
