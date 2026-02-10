const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const slug = req.query.slug || [];
    const path = slug.join('/');
    
    // Jika root, redirect ke contoh video
    if (!path) {
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy - Video Streaming</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: white; }
          .container { max-width: 500px; margin: 0 auto; }
          h1 { color: #3b82f6; }
          .btn { background: #3b82f6; color: white; padding: 12px 24px; 
                 text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎬 Vidoyy Streaming</h1>
          <p>Example video links:</p>
          <p><a href="/e/demo123" class="btn">Watch Demo Video 1</a></p>
          <p><a href="/e/demo456" class="btn">Watch Demo Video 2</a></p>
          <p>Or use: /e/VIDEO_ID or /d/VIDEO_ID</p>
        </div>
      </body>
      </html>`;
      return res.end(html);
    }
    
    // ===== TAMPILKAN HALAMAN ASLI DOODSTREAM DULU =====
    const targetUrl = `https://vidstrm.cloud/${path}`;
    console.log('Loading original page:', targetUrl);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    let html = await response.text();
    
    // ===== INJECT: KLIK → AFFILIATE =====
    const videoId = path.split('/').pop();
    
    const affiliateScript = `
      <script>
        (function() {
          'use strict';
          
          const videoId = '${videoId}';
          const affiliateLink = 'https://doobf.pro/8AQUp3ZesV';
          const storageKey = 'vidoyy_aff_' + videoId;
          
          // Cek cookie 24 jam
          function hasClickedToday() {
            const data = localStorage.getItem(storageKey);
            if (!data) return false;
            try {
              const { timestamp } = JSON.parse(data);
              return (Date.now() - timestamp) < (24 * 60 * 60 * 1000);
            } catch {
              return false;
            }
          }
          
          // Tunggu halaman FULLY loaded (video player muncul)
          function init() {
            // Kalau sudah klik hari ini, langsung biarkan
            if (hasClickedToday()) {
              console.log('Already supported today');
              return;
            }
            
            console.log('Waiting for user click...');
            
            // Tambah overlay transparan yang capture semua klik
            const overlay = document.createElement('div');
            overlay.id = 'clickRedirectLayer';
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 999998;
              cursor: pointer;
              background: transparent;
            \`;
            
            // Pesan kecil di pojok kanan atas
            const messageBox = document.createElement('div');
            messageBox.id = 'affiliateMessage';
            messageBox.style.cssText = \`
              position: fixed;
              top: 15px;
              right: 15px;
              background: rgba(0, 0, 0, 0.85);
              color: white;
              padding: 12px 18px;
              border-radius: 10px;
              font-size: 14px;
              z-index: 999999;
              border-left: 4px solid #3b82f6;
              max-width: 280px;
              box-shadow: 0 5px 20px rgba(0,0,0,0.3);
              animation: slideIn 0.5s ease;
              backdrop-filter: blur(5px);
            \`;
            
            messageBox.innerHTML = \`
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="background: #3b82f6; width: 8px; height: 8px; border-radius: 50%;"></div>
                <strong style="font-size: 15px;">Click to Play Video</strong>
              </div>
              <div style="font-size: 13px; color: #94a3b8; line-height: 1.4;">
                Support our free service by visiting our sponsor first
              </div>
            \`;
            
            // Animasi
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
              .clickable-video {
                position: relative;
                cursor: pointer !important;
              }
              .clickable-video::after {
                content: "▶️ Click to Support & Play";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(59, 130, 246, 0.9);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-weight: bold;
                z-index: 999997;
                animation: pulse 2s infinite;
                box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
                border: 2px solid white;
              }
            \`;
            document.head.appendChild(style);
            
            // Handler untuk klik
            function handleAffiliateRedirect(e) {
              e.preventDefault();
              e.stopPropagation();
              
              console.log('Redirecting to affiliate...');
              
              // 1. Buka affiliate di tab baru
              const affiliateWindow = window.open(affiliateLink, '_blank', 'noopener,noreferrer');
              
              // 2. Simpan ke localStorage
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: videoId
              }));
              
              // 3. Hapus overlay dan message
              overlay.remove();
              messageBox.remove();
              
              // 4. Hapus event listeners
              document.removeEventListener('click', handleAffiliateRedirect, true);
              document.removeEventListener('touchstart', handleAffiliateRedirect, true);
              
              // 5. Focus kembali setelah 1 detik
              setTimeout(() => {
                window.focus();
                
                // 6. Coba auto-play video
                const videoElement = document.querySelector('video');
                if (videoElement) {
                  setTimeout(() => {
                    videoElement.play().catch(err => {
                      console.log('User needs to click play manually');
                      // Tambah play button jika perlu
                      if (err.name === 'NotAllowedError') {
                        const playBtn = document.createElement('button');
                        playBtn.innerHTML = '▶ Play Video';
                        playBtn.style.cssText = \`
                          position: fixed;
                          bottom: 30px;
                          left: 50%;
                          transform: translateX(-50%);
                          background: #3b82f6;
                          color: white;
                          padding: 15px 30px;
                          border: none;
                          border-radius: 50px;
                          font-size: 16px;
                          font-weight: bold;
                          cursor: pointer;
                          z-index: 99999;
                          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        \`;
                        playBtn.onclick = () => {
                          videoElement.play();
                          playBtn.remove();
                        };
                        document.body.appendChild(playBtn);
                      }
                    });
                  }, 800);
                }
              }, 1000);
              
              return false;
            }
            
            // Tambah ke document
            document.body.appendChild(overlay);
            document.body.appendChild(messageBox);
            
            // Tambah event listeners
            overlay.addEventListener('click', handleAffiliateRedirect);
            document.addEventListener('click', handleAffiliateRedirect, true);
            document.addEventListener('touchstart', handleAffiliateRedirect, true);
            
            // Highlight video player
            setTimeout(() => {
              const videoPlayer = document.querySelector('video, iframe, #player, .player');
              if (videoPlayer) {
                videoPlayer.classList.add('clickable-video');
                videoPlayer.style.cursor = 'pointer';
                videoPlayer.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
              }
            }, 1000);
            
            // Auto-redirect setelah 20 detik (fallback)
            setTimeout(() => {
              if (document.getElementById('clickRedirectLayer')) {
                console.log('Auto-redirect fallback');
                handleAffiliateRedirect(new Event('auto'));
              }
            }, 20000);
          }
          
          // Start initialization
          if (document.readyState === 'complete') {
            setTimeout(init, 1000);
          } else {
            window.addEventListener('load', function() {
              setTimeout(init, 1500); // Tunggu lebih lama untuk video player
            });
          }
        })();
      </script>
    `;
    
    // Inject script ke HTML
    if (html.includes('</body>')) {
      html = html.replace('</body>', affiliateScript + '</body>');
    } else {
      html = html + affiliateScript;
    }
    
    // Fix URLs
    html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
    html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
    
    // Send response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>Error Loading Video</h1>
          <p>${error.message}</p>
          <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; 
             text-decoration: none; border-radius: 5px;">Go Home</a>
        </body>
      </html>
    `);
  }
};
