const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const slug = req.query.slug || [];
    const path = slug.join('/');
    
    if (!path) {
      return res.redirect('/');
    }
    
    // URL tujuan: vidstrm.cloud
    const targetUrl = `https://vidstrm.cloud/${path}`;
    console.log('Fetching:', targetUrl);
    
    // Fetch halaman asli
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    let html = await response.text();
    
    // ===== INJECT CLICK-TO-AFFILIATE SCRIPT =====
    const videoId = path.split('/').pop();
    
    const clickScript = `
      <script>
        (function() {
          'use strict';
          
          const videoId = '${videoId}';
          const affiliateLink = 'https://doobf.pro/8AQUp3ZesV';
          const storageKey = 'vidoyy_click_' + videoId;
          
          // Cek apakah sudah klik hari ini
          function hasClickedToday() {
            const data = localStorage.getItem(storageKey);
            if (!data) return false;
            
            try {
              const { timestamp } = JSON.parse(data);
              const now = Date.now();
              const oneDay = 24 * 60 * 60 * 1000;
              return (now - timestamp) < oneDay;
            } catch {
              return false;
            }
          }
          
          // Tunggu halaman selesai load
          window.addEventListener('load', function() {
            // Jika sudah klik hari ini, skip
            if (hasClickedToday()) {
              console.log('Already clicked today, playing video directly');
              return;
            }
            
            // Tambah transparan overlay yang capture semua klik
            const clickOverlay = document.createElement('div');
            clickOverlay.id = 'clickRedirectOverlay';
            clickOverlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 999999;
              cursor: pointer;
              background: rgba(0, 0, 0, 0.01); /* Hampir transparan */
            \`;
            
            // Message kecil di pojok
            const messageBox = document.createElement('div');
            messageBox.style.cssText = \`
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 10px 15px;
              border-radius: 8px;
              font-size: 12px;
              z-index: 1000000;
              border-left: 3px solid #3b82f6;
              max-width: 250px;
              animation: slideIn 0.5s ease;
            \`;
            
            messageBox.innerHTML = \`
              <strong>🎬 Click anywhere to continue</strong><br>
              <small>Support our platform to play video</small>
            \`;
            
            // Tambah keyframes untuk animasi
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              @keyframes pulse {
                0% { opacity: 0.3; }
                50% { opacity: 0.7; }
                100% { opacity: 0.3; }
              }
              .pulse-border {
                animation: pulse 2s infinite;
                border: 2px solid rgba(59, 130, 246, 0.5);
              }
            \`;
            document.head.appendChild(style);
            
            // Event handler untuk klik
            function handleClick(e) {
              e.preventDefault();
              e.stopPropagation();
              
              console.log('User clicked, redirecting to affiliate...');
              
              // Buka affiliate di tab baru
              const newTab = window.open(affiliateLink, '_blank', 'noopener,noreferrer');
              
              // Simpan di localStorage
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: videoId
              }));
              
              // Hapus overlay
              clickOverlay.remove();
              messageBox.remove();
              
              // Hapus event listener
              document.removeEventListener('click', handleClick, true);
              document.removeEventListener('touchstart', handleClick, true);
              
              // Focus kembali ke window ini setelah 1 detik
              setTimeout(() => {
                window.focus();
                
                // Auto-play video jika ada
                const video = document.querySelector('video');
                if (video) {
                  setTimeout(() => {
                    video.play().catch(err => {
                      console.log('Auto-play prevented, user can click play manually');
                    });
                  }, 500);
                }
              }, 1000);
              
              return false;
            }
            
            // Tambah ke document
            document.body.appendChild(clickOverlay);
            document.body.appendChild(messageBox);
            
            // Tambah event listeners
            clickOverlay.addEventListener('click', handleClick);
            document.addEventListener('click', handleClick, true); // Capture phase
            document.addEventListener('touchstart', handleClick, true);
            
            // Auto-redirect setelah 15 detik (fallback)
            setTimeout(() => {
              if (document.getElementById('clickRedirectOverlay')) {
                console.log('Auto-redirect after 15 seconds');
                handleClick(new Event('auto'));
              }
            }, 15000);
            
            // Tambah border pulse ke video player untuk indikasi
            setTimeout(() => {
              const videoPlayer = document.querySelector('video, iframe, #player, .player');
              if (videoPlayer) {
                videoPlayer.classList.add('pulse-border');
                videoPlayer.style.transition = 'border-color 0.3s';
              }
            }, 500);
          });
          
          // Fallback jika load event sudah lewat
          if (document.readyState === 'complete') {
            setTimeout(() => window.dispatchEvent(new Event('load')), 500);
          }
        })();
      </script>
    `;
    
    // ===== INJECT KE HTML =====
    
    // Inject di head untuk styling
    if (html.includes('</head>')) {
      html = html.replace('</head>', clickScript + '</head>');
    } else {
      html = clickScript + html;
    }
    
    // Fix relative URLs
    html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
    html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
    html = html.replace(/url\(\//g, 'url(https://vidstrm.cloud/');
    
    // Set headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Kirim HTML
    res.send(html);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy - Error</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; }
          .error { background: #fee; padding: 20px; border-radius: 10px; margin: 20px; }
          .btn { background: #3b82f6; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px; }
        </style>
      </head>
      <body>
        <h1>🎬 Vidoyy</h1>
        <div class="error">
          <h3>⚠️ Error Loading Video</h3>
          <p><strong>Error:</strong> ${error.message}</p>
          <a href="/" class="btn">Go Home</a>
          <a href="https://doobf.pro/8AQUp3ZesV" target="_blank" class="btn">Visit Sponsor</a>
        </div>
      </body>
      </html>
    `);
  }
};
