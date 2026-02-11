const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidoza.net';

const AFFILIATE_LINKS = [
  'https://s.shopee.co.id/8AQUp3ZesV',
  'https://s.shopee.co.id/9pYio8K2cw', 
  'https://s.shopee.co.id/8pgBcJjIzl',
  'https://s.shopee.co.id/60M0F7txlS',
  'https://s.shopee.co.id/7VAo1N0hIp',
  'https://s.shopee.co.id/9KcSCm0Xb7',
  'https://s.shopee.co.id/3LLF3lT65E',
  'https://s.shopee.co.id/6VIGpbCEoc'
];

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.url;
    const currentPath = req.url;
    
    const response = await fetch(targetUrl);
    let html = await response.text();
    
    // SCRIPT: 1 KLIK → SHOPEE → REDIRECT ASLI
    const script = `
    <script>
      const links = ${JSON.stringify(AFFILIATE_LINKS)};
      const originalUrl = '${targetUrl}';
      let hasClicked = false;
      
      function handleClick() {
        if (hasClicked) return;
        hasClicked = true;
        
        // 1. Buka Shopee affiliate
        const shopeeUrl = links[Math.floor(Math.random() * links.length)];
        window.open(shopeeUrl, '_blank');
        
        // 2. Langsung redirect ke URL asli (vidoza)
        setTimeout(() => {
          window.location.href = '${BASE_URL}${currentPath}';
        }, 300);
      }
      
      // Klik dimana saja di halaman
      document.addEventListener('click', handleClick);
      
      // Auto-click setelah 7 detik
      setTimeout(() => {
        if (!hasClicked) handleClick();
      }, 7000);
    </script>
    
    <style>
      #redirect-info {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #EE4D2D;
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
      }
      .countdown {
        font-weight: bold;
        background: white;
        color: #EE4D2D;
        padding: 3px 10px;
        border-radius: 15px;
        display: inline-block;
        margin: 0 5px;
      }
    </style>
    `;
    
    // INFO BOX
    const infoBox = `
    <div id="redirect-info">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 20px; margin-right: 10px;">⚡</span>
        <div>
          <b>Redirect otomatis dalam: <span class="countdown">7</span> detik</b>
        </div>
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        Klik <u>dimana saja</u> untuk play video
      </div>
    </div>
    
    <script>
      // Update countdown
      let timeLeft = 7;
      const countdownEl = document.querySelector('.countdown');
      const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          document.getElementById('redirect-info').style.display = 'none';
        }
      }, 1000);
    </script>
    `;
    
    // Inject ke HTML
    html = html.replace('</body>', script + infoBox + '</body>');
    
    // Fix internal links agar tetap melalui proxy kita
    html = html.replace(/href="https:\/\/vidoza\.net\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Jika error, langsung ke Shopee
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Redirect: 1 Click → Shopee → ${BASE_URL}`);
});
