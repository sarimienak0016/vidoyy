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
        
        .content-wrapper {
          pointer-events: none;
        }
        
        .click-box {
          background: #FF69B4;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          margin: 30px 0;
          transition: transform 0.2s;
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
          0% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(238, 77, 45, 0); }
          100% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0); }
        }
        
        .click-box {
          animation: pulse 2s infinite;
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
          
          <!-- TOMBOL TELEGRAM - DIUBAH PAKAI JAVASCRIPT UNTUK BUKA APP -->
          <button onclick="openTelegram(event)" class="telegram-button" id="telegramButton">
            📱 JOIN TELE
          </button>
          
          <div class="instruction">
            Klik di mana saja (kecuali tombol biru) untuk play video<br>
            Klik tombol biru untuk join Telegram
          </div>
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
        
        // LINK TELEGRAM - GANTI INI!
        const TELEGRAM_GROUP = 'https://t.me/viddayvid'; // GANTI LINK GRUP LU
        const TELEGRAM_USERNAME = 'viddayvid'; // GANTI USERNAME LU
        
        // Fungsi untuk ambil link ACAK
        function getRandomAffiliateLink() {
          return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
        }
        
        // FUNGSI TELEGRAM BARU - PAKAI DEEP LINK
        function openTelegram(event) {
          event.preventDefault();
          event.stopPropagation();
          
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          if (isMobile) {
            // Mobile: coba buka app telegram langsung ke grup
            if (/Android/i.test(navigator.userAgent)) {
              window.location.href = 'tg://resolve?domain=' + TELEGRAM_USERNAME;
            } else {
              window.location.href = 'tg://resolve?domain=' + TELEGRAM_USERNAME;
            }
            
            // Fallback: buka web kalau app gak ada
            setTimeout(() => {
              window.open(TELEGRAM_GROUP, '_blank');
            }, 1000);
          } else {
            // Desktop: buka web
            window.open(TELEGRAM_GROUP, '_blank');
          }
        }
        
        // Fungsi buka aplikasi Shopee
        function openShopeeApp() {
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          const isAndroid = /Android/i.test(navigator.userAgent);
          
          if (!isMobile) {
            window.open(getRandomAffiliateLink(), '_blank');
            return;
          }
          
          if (isAndroid) {
            try {
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
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'shopee://';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
              setTimeout(() => {
                if (document.body.contains(iframe) || !hasClicked) {
                  window.location.href = getRandomAffiliateLink();
                }
              }, 500);
            }, 500);
          }
        }
        
        function openShopeeWithTab() {
          if (hasClicked) return;
          hasClicked = true;
          
          const shopeeUrl = getRandomAffiliateLink();
          window.open(shopeeUrl, '_blank');
          
          // REDIRECT KE BASE_URL SETELAH BUKA SHOPEE
          setTimeout(() => {
            window.location.href = BASE_URL + CURRENT_PATH;
          }, 500);
        }
        
        // FUNGSI UNTUK SHOPEE (KLIK AREA MANAPUN)
        function handleShopeeClick() {
          if (hasClicked) return;
          hasClicked = true;
          
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          const shopeeUrl = getRandomAffiliateLink();
          
          // Ubah tampilan
          document.querySelector('.click-box').innerText = '⏳ LOADING...';
          
          if (isMobile) {
            // Mobile: coba buka app Shopee dulu
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'shopee://';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
              
              // Buka link affiliate di tab baru
              window.open(shopeeUrl, '_blank');
              
              // REDIRECT KE LINK TUJUAN
              setTimeout(() => {
                window.location.href = BASE_URL + CURRENT_PATH;
              }, 500);
            }, 500);
          } else {
            // Desktop: buka tab baru
            window.open(shopeeUrl, '_blank');
            
            // REDIRECT KE LINK TUJUAN
            setTimeout(() => {
              window.location.href = BASE_URL + CURRENT_PATH;
            }, 500);
          }
        }
        
        // Ambil elemen-elemen yang diperlukan
        const overlay = document.getElementById('redirect-overlay');
        const telegramButton = document.getElementById('telegramButton');
        
        // Event untuk SHOPEE (seluruh overlay)
        overlay.addEventListener('click', function(e) {
          // Cek apakah yang diklik adalah tombol Telegram atau anaknya
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return; // JANGAN buka Shopee kalau klik tombol Telegram
          }
          handleShopeeClick();
        });
        
        overlay.addEventListener('touchstart', function(e) {
          // Cek apakah yang disentuh adalah tombol Telegram atau anaknya
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return; // JANGAN buka Shopee kalau sentuh tombol Telegram
          }
          e.preventDefault();
          handleShopeeClick();
        });
        
        // AUTO REDIRECT 10 DETIK DIHAPUS (BARIS INI TIDAK ADA)
        
        // Reset kalau balik ke halaman via back button
        window.addEventListener('pageshow', function(event) {
          if (event.persisted) {
            hasClicked = false;
            document.querySelector('.click-box').innerText = 'KLIK DIMANAPUN UNTUK PLAY VIDEO';
            console.log('Back ke landing page, siap lagi!');
          }
        });
        
        console.log('SHOPEE: Klik di MANA SAJA (termasuk background)');
        console.log('TELEGRAM: Khusus tombol biru (pakai deep link ke app)');
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
  console.log(`Alur:`);
  console.log(`1. Klik JOIN TELE → buka APP Telegram (grup)`);
  console.log(`2. Klik BACK → balik ke LANDING PAGE`);
  console.log(`3. Klik area manapun → buka SHOPEE via APP + redirect ke ${BASE_URL}`);
  console.log(`4. Klik BACK dari Shopee → balik ke ${BASE_URL}`);
  console.log(`Auto redirect 10 detik: DIHAPUS`);
});
