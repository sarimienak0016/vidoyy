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
      // 1. HAPUS SEMUA ANIMASI DARI HTML ASLI
      html = html.replace(/@keyframes[^{]+\{[^}]+\}/gi, '');
      html = html.replace(/animation:[^;]+;/gi, '');
      html = html.replace(/animation-name:[^;]+;/gi, '');
      html = html.replace(/animation-duration:[^;]+;/gi, '');
      html = html.replace(/animation-iteration-count:[^;]+;/gi, '');
      html = html.replace(/countdown/g, ''); // Hapus teks countdown
      
      // 2. OVERLAY STATIC TANPA ANIMASI
      const overlayHTML = `<div id="click-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999999;display:flex;align-items:center;justify-content:center;color:white;font-family:Arial;text-align:center;cursor:pointer;">
        <div style="padding:30px;background:#EE4D2D;border-radius:8px;max-width:500px;width:90%;">
          <div style="font-size:50px;margin-bottom:15px;">🛒</div>
          <h1 style="margin:0 0 15px 0;font-size:22px;font-weight:bold;">KLIK UNTUK MELANJUTKAN KE SHOPEE</h1>
          <p style="margin:0 0 20px 0;font-size:16px;">Klik dimanapun di layar ini</p>
          <div style="background:white;color:#EE4D2D;padding:12px 30px;border-radius:4px;font-weight:bold;font-size:16px;display:inline-block;">
            KLIK DISINI
          </div>
        </div>
      </div>`;
      
      // 3. SCRIPT SANGAT SEDERHANA
      const simpleScript = `<script>
        const links = ${JSON.stringify(AFFILIATE_LINKS)};
        let clicked = false;
        
        function openShopee() {
          if (clicked) return;
          clicked = true;
          const url = links[Math.floor(Math.random() * links.length)];
          window.location.href = url;
        }
        
        // Overlay click
        document.getElementById('click-overlay').onclick = openShopee;
        
        // Link clicks setelah overlay hilang
        document.addEventListener('click', function(e) {
          if (clicked) {
            const link = e.target.closest('a');
            if (link && link.href) {
              e.preventDefault();
              const url = links[Math.floor(Math.random() * links.length)];
              window.open(url, '_blank');
              setTimeout(() => window.location.href = link.href, 300);
            }
          }
        });
      </script>`;
      
      // 4. STYLE UNTUK BLOCK SCROLL SAJA
      const blockScrollStyle = `<style>
        body { overflow: hidden !important; height: 100vh !important; margin: 0 !important; }
        #click-overlay { position: fixed !important; }
      </style>`;
      
      // 5. INJECT SEMUA
      // Inject style di head
      if (html.includes('</head>')) {
        html = html.replace('</head>', blockScrollStyle + '</head>');
      } else if (html.includes('<head>')) {
        html = html.replace('<head>', '<head>' + blockScrollStyle);
      }
      
      // Inject overlay sebagai elemen pertama di body
      if (html.includes('<body')) {
        html = html.replace(/<body[^>]*>/i, '$&' + overlayHTML);
      } else {
        html = overlayHTML + html;
      }
      
      // Inject script di sebelum </body>
      if (html.includes('</body>')) {
        html = html.replace('</body>', simpleScript + '</body>');
      } else {
        html = html + simpleScript;
      }
      
      // 6. HAPUS SEMUA TIMER/COUNTDOWN DARI HTML ASLI
      html = html.replace(/setTimeout\([^)]+\)/g, '');
      html = html.replace(/setInterval\([^)]+\)/g, '');
      html = html.replace(/\d+\s*detik/gi, '');
      html = html.replace(/countdown/gi, '');
      
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
    // FALLBACK: HTML SANGAT SEDERHANA TANPA APAPUN
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background: black; 
            height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-family: Arial; 
          }
          .box { 
            background: #EE4D2D; 
            color: white; 
            padding: 40px; 
            text-align: center; 
            border-radius: 5px; 
            max-width: 500px; 
            cursor: pointer; 
          }
          h1 { 
            margin: 0 0 15px 0; 
            font-size: 22px; 
          }
          .btn { 
            background: white; 
            color: #EE4D2D; 
            padding: 12px 30px; 
            border-radius: 4px; 
            font-weight: bold; 
            margin-top: 15px; 
            display: inline-block; 
          }
        </style>
      </head>
      <body onclick="window.location.href='${randomLink}'">
        <div class="box">
          <div style="font-size:40px;">👉</div>
          <h1>KLIK UNTUK MELANJUTKAN</h1>
          <p>Klik dimanapun di layar ini</p>
          <div class="btn">KLIK</div>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`✅ SERVER READY - NO COUNTDOWN`);
  console.log(`👉 User harus klik overlay untuk lanjut`);
  console.log(`🎯 ${AFFILIATE_LINKS.length} affiliate links`);
  console.log(`🚫 NO animations, NO timers, NO countdown`);
});
