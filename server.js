const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

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
      // OVERLAY FULLSCREEN YANG MEMAKSA KLIK
      const overlayHTML = `
        <div id="force-click-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div style="
            background: linear-gradient(135deg, #EE4D2D, #FF7337);
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: pulse 2s infinite;
          ">
            <div style="font-size: 48px; margin-bottom: 20px;">🔔</div>
            <h1 style="margin: 0 0 15px 0; font-size: 24px;">
              KLIK DIMANAPUN UNTUK MELANJUTKAN
            </h1>
            <p style="margin: 0 0 25px 0; font-size: 16px; opacity: 0.9;">
              Anda akan diarahkan ke Aplikasi Shopee terlebih dahulu
            </p>
            <div style="
              background: white;
              color: #EE4D2D;
              padding: 15px 30px;
              border-radius: 50px;
              font-weight: bold;
              font-size: 18px;
              cursor: pointer;
              display: inline-block;
              margin-top: 10px;
            " id="click-continue-btn">
              Klik untuk Lanjut
            </div>
            <p style="margin-top: 20px; font-size: 14px; opacity: 0.7;">
              Klik dimanapun di layar ini
            </p>
          </div>
        </div>
        
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          
          #force-click-overlay {
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          body {
            overflow: hidden !important;
            height: 100vh !important;
          }
        </style>
      `;
      
      // SCRIPT UNTUK FORCE CLICK
      const forceScript = `
        <script>
          const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
          let shopeeOpened = false;
          
          // Function untuk buka Shopee
          function openShopeeAffiliate() {
            if (shopeeOpened) return;
            
            shopeeOpened = true;
            const shopeeUrl = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
            console.log('Opening Shopee:', shopeeUrl);
            
            // Coba semua method untuk buka app
            // 1. Direct window.location
            window.location.href = shopeeUrl;
            
            // 2. Open new tab sebagai backup
            setTimeout(() => {
              window.open(shopeeUrl, '_blank');
            }, 300);
            
            return shopeeUrl;
          }
          
          // Function untuk hide overlay dan lanjut ke konten asli
          function continueToContent() {
            const overlay = document.getElementById('force-click-overlay');
            if (overlay) {
              overlay.style.display = 'none';
            }
            document.body.style.overflow = 'auto';
            console.log('Continuing to main content...');
          }
          
          // Function untuk handle klik user
          function handleUserClick() {
            // 1. Buka Shopee dulu
            openShopeeAffiliate();
            
            // 2. Tunggu sebentar lalu lanjut ke konten
            setTimeout(() => {
              continueToContent();
            }, 500);
          }
          
          // Setup event listeners
          document.addEventListener('DOMContentLoaded', function() {
            const overlay = document.getElementById('force-click-overlay');
            const continueBtn = document.getElementById('click-continue-btn');
            
            // Klik dimanapun di overlay
            overlay.addEventListener('click', handleUserClick);
            
            // Klik tombol khusus
            continueBtn.addEventListener('click', handleUserClick);
            
            // Juga tangani klik di seluruh dokumen (backup)
            document.addEventListener('click', function(e) {
              if (e.target.closest('#force-click-overlay')) {
                handleUserClick();
              }
            }, { once: true });
            
            console.log('Force-click overlay ready! User must click to continue.');
          });
          
          // Tangani klik di konten asli (setelah overlay hilang)
          document.addEventListener('click', function(e) {
            // Hanya aktif setelah overlay hilang
            if (document.getElementById('force-click-overlay')?.style.display === 'none') {
              const link = e.target.closest('a');
              if (link && link.href) {
                e.preventDefault();
                e.stopPropagation();
                
                // Buka Shopee lagi untuk klik ini
                const shopeeUrl = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
                window.open(shopeeUrl, '_blank');
                
                // Redirect ke tujuan asli
                setTimeout(() => {
                  window.location.href = link.href;
                }, 300);
              }
            }
          }, true);
        </script>
      `;
      
      // Inject overlay di awal body
      if (html.includes('<body')) {
        html = html.replace('<body', '<body>' + overlayHTML);
      } else {
        html = overlayHTML + html;
      }
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', forceScript + '</head>');
      } else {
        html = forceScript + html;
      }
      
      // Rewrite links
      html = html.replace(
        /(href|src|action)=["'](https?:)?\/\/vidstrm\.cloud(\/[^"']*)["']/gi,
        (match, attr, protocol, path) => `${attr}="${path}"`
      );
      
      // Force body styles
      html = html.replace('<head>', '<head><style>body{overflow:hidden!important;height:100vh!important;}</style>');
    }
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    }).send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback simple page dengan force click
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.send(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #000;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: Arial;
            }
            .overlay {
              background: linear-gradient(135deg, #EE4D2D, #FF7337);
              padding: 40px;
              border-radius: 20px;
              color: white;
              text-align: center;
              max-width: 500px;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            .btn {
              background: white;
              color: #EE4D2D;
              padding: 15px 40px;
              border-radius: 50px;
              font-weight: bold;
              font-size: 20px;
              cursor: pointer;
              display: inline-block;
              margin-top: 20px;
              border: none;
            }
          </style>
        </head>
        <body onclick="window.open('${randomLink}', '_blank'); setTimeout(()=>{window.location.href='${BASE_URL}${req.originalUrl}';}, 500);">
          <div class="overlay">
            <h1>KLIK DIMANAPUN UNTUK MELANJUTKAN</h1>
            <p>Anda akan diarahkan ke Aplikasi Shopee terlebih dahulu</p>
            <button class="btn">Klik di Sini</button>
            <p style="margin-top:20px;font-size:14px;">Klik dimanapun di layar ini</p>
          </div>
          
          <script>
            // Buka Shopee saat page load (tapi tunggu klik user)
            let shopeeUrl = '${randomLink}';
            console.log('Ready. Click anywhere to open Shopee and continue.');
          </script>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`👆 Server dengan Force-Click System`);
  console.log(`🎯 User HARUS klik untuk melanjutkan`);
  console.log(`🛒 ${AFFILIATE_LINKS.length} affiliate links ready`);
});
