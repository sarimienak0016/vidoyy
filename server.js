const express = require('express');
const fetch = require('node-fetch');

// Inisialisasi app
const app = express();

// Base URL
const BASE_URL = 'https://vidstrm.cloud';

// Affiliate links
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

// Handler untuk SEMUA route
app.all('*', async (req, res) => {
  try {
    console.log('Request URL:', req.url);
    
    const targetUrl = BASE_URL + req.url;
    
    // Fetch halaman asli
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    let html = await response.text();
    
    // ===== HAPUS COUNTDOWN SAJA =====
    // 1. Remove countdown text
    html = html.replace(/\b\d+\s*(detik|seconds|sec)\b/gi, '');
    
    // 2. Remove countdown intervals
    html = html.replace(/setInterval\([^)]*countdown[^)]*\)/gi, '// removed');
    html = html.replace(/setInterval\([^)]*timer[^)]*\)/gi, '// removed');
    
    // 3. Remove auto-redirect timeouts
    html = html.replace(/setTimeout\([^)]*location\.href[^)]*\)/gi, '// removed');
    html = html.replace(/setTimeout\([^)]*redirect[^)]*\)/gi, '// removed');
    
    // ===== TAMBAH OVERLAY SEDERHANA =====
    const overlayCode = `
    <div id="shopee-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.95);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial;
      color: white;
      cursor: pointer;
    ">
      <div style="
        background: #EE4D2D;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 500px;
      ">
        <div style="font-size: 40px; margin-bottom: 15px;">👉</div>
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
          KLIK UNTUK MELANJUTKAN
        </div>
        <div style="font-size: 14px; margin-bottom: 20px; opacity: 0.9;">
          Klik dimanapun di layar ini
        </div>
        <div style="
          background: white;
          color: #EE4D2D;
          padding: 10px 25px;
          border-radius: 5px;
          display: inline-block;
          font-weight: bold;
          cursor: pointer;
        ">
          KLIK DISINI
        </div>
      </div>
    </div>
    
    <script>
      // Overlay click handler
      document.getElementById('shopee-overlay').onclick = function() {
        const links = ${JSON.stringify(AFFILIATE_LINKS)};
        const url = links[Math.floor(Math.random() * links.length)];
        window.location.href = url;
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      };
      
      // After overlay is gone, handle link clicks
      document.addEventListener('click', function(e) {
        if (document.getElementById('shopee-overlay').style.display === 'none') {
          const link = e.target.closest('a');
          if (link && link.href) {
            e.preventDefault();
            const links = ${JSON.stringify(AFFILIATE_LINKS)};
            const url = links[Math.floor(Math.random() * links.length)];
            window.open(url, '_blank');
            setTimeout(() => {
              window.location.href = link.href;
            }, 300);
          }
        }
      });
    </script>
    
    <style>
      body {
        overflow: hidden !important;
        height: 100vh !important;
      }
    </style>
    `;
    
    // Inject overlay ke HTML
    html = html.replace('<body', overlayCode + '<body');
    
    // Fix internal links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    // Send response
    res.set('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback ke affiliate link
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

// Export untuk Vercel
module.exports = app;
