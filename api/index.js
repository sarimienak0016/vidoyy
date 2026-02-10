const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Ambil path dari URL
    const slug = req.query.slug || [];
    const path = slug.join('/');
    
    console.log('Request path:', path);
    
    // Jika tidak ada path atau root, redirect ke landing
    if (!path || path === '') {
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy Streaming</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: white; }
          .container { max-width: 500px; margin: 0 auto; }
          h1 { color: #3b82f6; }
          input { padding: 12px; width: 300px; margin: 10px; border-radius: 8px; border: 2px solid #475569; }
          button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎬 Vidoyy Streaming</h1>
          <p>Enter vidstrm.cloud video URL:</p>
          <input id="url" placeholder="https://vidstrm.cloud/e/abc123" value="https://vidstrm.cloud/e/demo">
          <button onclick="watch()">Watch Video</button>
          <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">
            Format: https://vidstrm.cloud/e/VIDEO_ID<br>
            or https://vidstrm.cloud/d/VIDEO_ID
          </p>
        </div>
        <script>
          function watch() {
            const url = document.getElementById('url').value;
            const match = url.match(/vidstrm\\.cloud\\/(e|d|v)\\/([a-zA-Z0-9]+)/);
            if (match) {
              window.location.href = '/' + match[1] + '/' + match[2];
            } else {
              alert('Invalid URL format');
            }
          }
        </script>
      </body>
      </html>`;
      return res.end(html);
    }
    
    // ===== PROXY KE HALAMAN ASLI DOODSTREAM =====
    const targetUrl = `https://vidstrm.cloud/${path}`;
    console.log('Proxying to:', targetUrl);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    let html = await response.text();
    
    // ===== INJECT KLIK → AFFILIATE SCRIPT =====
    const videoId = path.split('/').pop();
    
    const affiliateScript = `
      <script>
        (function() {
          'use strict';
          
          const videoId = '${videoId}';
          const affiliateLink = 'https://doobf.pro/8AQUp3ZesV';
          const storageKey = 'vidoyy_' + videoId;
          const oneDay = 24 * 60 * 60 * 1000;
          
          // Cek jika sudah klik dalam 24 jam terakhir
          function hasClickedRecently() {
            const data = localStorage.getItem(storageKey);
            if (!data) return false;
            
            try {
              const { timestamp } = JSON.parse(data);
              const now = Date.now();
              return (now - timestamp) < oneDay;
            } catch {
              return false;
            }
          }
          
          // Tunggu halaman dan video player siap
          function initialize() {
            // Skip jika sudah klik hari ini
            if (hasClickedRecently()) {
              console.log('Already clicked today, video should play');
              return;
            }
            
            console.log('Adding click-to-affiliate overlay');
            
            // 1. BUAT OVERLAY TRANSPARAN UNTUK CAPTURE KLIK
            const overlay = document.createElement('div');
            overlay.id = 'vidoyyClickOverlay';
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 999999;
              cursor: pointer;
              background: rgba(0, 0, 0, 0.7);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              text-align: center;
              padding: 20px;
              font-family: Arial, sans-serif;
            \`;
            
            overlay.innerHTML = \`
              <div style="
                max-width: 500px;
                background: rgba(30, 41, 59, 0.95);
                padding: 40px;
                border-radius: 20px;
                border: 3px solid #3b82f6;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
              ">
                <div style="font-size: 48px; margin-bottom: 20px;">🎬</div>
                <h2 style="margin-bottom: 15px; color: #3b82f6;">Video Ready to Play!</h2>
                <p style="margin-bottom: 25px; font-size: 18px;">
                  Click anywhere to support our free service
                </p>
                
                <div style="
                  background: rgba(59, 130, 246, 0.2);
                  padding: 20px;
                  border-radius: 12px;
                  margin: 20px 0;
                  text-align: left;
                  border-left: 4px solid #3b82f6;
                ">
                  <p>• Support will open in new tab</p>
                  <p>• Video plays automatically after</p>
                  <p>• Only once every 24 hours</p>
                </div>
                
                <button id="supportBtn" style="
                  background: linear-gradient(135deg, #3b82f6, #2563eb);
                  color: white;
                  border: none;
                  padding: 18px 40px;
                  font-size: 18px;
                  border-radius: 50px;
                  cursor: pointer;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                  margin: 20px 0;
                  width: 100%;
                  max-width: 350px;
                ">
                  🛍️ Click to Support & Play
                </button>
                
                <p style="color: #94a3b8; font-size: 14px; margin-top: 15px;">
                  <span id="countdown">5</span> seconds until auto-continue
                </p>
              </div>
            \`;
            
            // 2. TAMPILKAN HALAMAN ASLI DI BELAKANG (BLURED)
            document.body.style.filter = 'blur(5px)';
            document.body.style.pointerEvents = 'none';
            
            // 3. TAMBAH OVERLAY KE DOKUMEN
            document.body.appendChild(overlay);
            
            // 4. COUNTDOWN AUTO-REDIRECT
            let countdown = 5;
            const countdownEl = document.getElementById('countdown');
            const countdownInterval = setInterval(() => {
              countdown--;
              countdownEl.textContent = countdown;
              
              if (countdown <= 0) {
                clearInterval(countdownInterval);
                handleAffiliateRedirect();
              }
            }, 1000);
            
            // 5. FUNGSI HANDLE REDIRECT
            function handleAffiliateRedirect() {
              console.log('Redirecting to affiliate');
              
              // Buka affiliate di tab baru
              window.open(affiliateLink, '_blank', 'noopener,noreferrer');
              
              // Simpan ke localStorage
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: videoId
              }));
              
              // Hapus overlay dan restore halaman
              overlay.remove();
              document.body.style.filter = '';
              document.body.style.pointerEvents = '';
              
              // Clear interval
              clearInterval(countdownInterval);
              
              // Auto-play video setelah 1 detik
              setTimeout(() => {
                const videoElement = document.querySelector('video');
                if (videoElement) {
                  videoElement.play().catch(err => {
                    console.log('Auto-play blocked, user can click play manually');
                  });
                }
              }, 1000);
            }
            
            // 6. EVENT LISTENERS
            overlay.addEventListener('click', handleAffiliateRedirect);
            document.getElementById('supportBtn').addEventListener('click', handleAffiliateRedirect);
            
            // 7. FALLBACK: Auto-remove setelah 30 detik
            setTimeout(() => {
              if (document.getElementById('vidoyyClickOverlay')) {
                console.log('Fallback: removing overlay');
                overlay.remove();
                document.body.style.filter = '';
                document.body.style.pointerEvents = '';
                localStorage.setItem(storageKey, JSON.stringify({
                  timestamp: Date.now(),
                  videoId: videoId
                }));
              }
            }, 30000);
          }
          
          // 8. INITIALIZE SETELAH HALAMAN LOAD
          if (document.readyState === 'complete') {
            setTimeout(initialize, 1000);
          } else {
            window.addEventListener('load', function() {
              setTimeout(initialize, 1500);
            });
          }
          
        })();
      </script>
    `;
    
    // INJECT SCRIPT KE HTML
    if (html.includes('</body>')) {
      html = html.replace('</body>', affiliateScript + '</body>');
    } else {
      html = html + affiliateScript;
    }
    
    // FIX RELATIVE URLs
    html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
    html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
    html = html.replace(/url\(\//g, 'url(https://vidstrm.cloud/');
    
    // KIRIM RESPONSE
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(html);
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error - Vidoyy</title>
      <style>
        body { font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: white; }
        .error { background: rgba(239, 68, 68, 0.1); padding: 30px; border-radius: 15px; margin: 20px; border-left: 4px solid #ef4444; }
        .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px; }
      </style>
    </head>
    <body>
      <h1>🎬 Vidoyy Streaming</h1>
      <div class="error">
        <h3>⚠️ Error Loading Video</h3>
        <p><strong>${error.message}</strong></p>
        <p>Please check the video URL or try again.</p>
        <a href="/" class="btn">Go Home</a>
        <a href="https://doobf.pro/8AQUp3ZesV" target="_blank" class="btn">Visit Sponsor</a>
      </div>
    </body>
    </html>`;
    
    res.status(500).send(errorHtml);
  }
};
