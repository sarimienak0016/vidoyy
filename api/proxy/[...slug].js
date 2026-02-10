const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Ambil path dari request
    const slug = req.query.slug || [];
    const path = slug.join('/');
    
    if (!path) {
      return res.redirect('/');
    }
    
    // VidStream URL asli (vidstrm.cloud)
    const doodstreamDomain = process.env.DOODSTREAM_DOMAIN || 'vidstrm.cloud';
    const doodstreamUrl = `https://${doodstreamDomain}/${path}`;
    
    console.log('Fetching:', doodstreamUrl);
    
    // Fetch HTML dari vidstrm
    const response = await fetch(doodstreamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': `https://${doodstreamDomain}/`,
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'max-age=0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    let html = await response.text();
    
    // ================= AFFILIATE INJECTION =================
    const videoId = path.split('/').pop();
    const affiliateLink = process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV';
    const siteName = process.env.SITE_NAME || 'VidStream';
    
    // Inject CSS untuk overlay
    const affiliateCSS = `
      <style id="affiliate-overlay-style">
        #affiliateOverlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.98) !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          text-align: center !important;
          padding: 20px !important;
          font-family: Arial, sans-serif !important;
          backdrop-filter: blur(5px) !important;
        }
        
        #affiliateContent {
          max-width: 500px !important;
          background: rgba(20, 20, 20, 0.95) !important;
          padding: 40px 30px !important;
          border-radius: 20px !important;
          border: 2px solid #3b82f6 !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7) !important;
          animation: fadeInUp 0.5s ease !important;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .affiliate-logo {
          color: #3b82f6 !important;
          font-size: 36px !important;
          font-weight: bold !important;
          margin-bottom: 15px !important;
          font-family: Arial, sans-serif !important;
          text-shadow: 0 2px 10px rgba(59, 130, 246, 0.5) !important;
        }
        
        .affiliate-subtitle {
          color: #60a5fa !important;
          font-size: 14px !important;
          margin-bottom: 25px !important;
          opacity: 0.8 !important;
        }
        
        .affiliate-title {
          font-size: 26px !important;
          margin-bottom: 20px !important;
          color: white !important;
          font-weight: 600 !important;
        }
        
        .affiliate-message {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1)) !important;
          padding: 25px !important;
          border-radius: 15px !important;
          border-left: 4px solid #3b82f6 !important;
          margin: 25px 0 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          text-align: left !important;
        }
        
        .affiliate-message p {
          margin: 10px 0 !important;
        }
        
        .affiliate-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
          border: none !important;
          padding: 18px 40px !important;
          font-size: 18px !important;
          border-radius: 50px !important;
          cursor: pointer !important;
          margin: 20px 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
          font-weight: bold !important;
          transition: all 0.3s !important;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
          width: 100% !important;
          max-width: 350px !important;
        }
        
        .affiliate-btn:hover {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6) !important;
          background: linear-gradient(135deg, #2563eb, #1e40af) !important;
        }
        
        .countdown-text {
          color: #60a5fa !important;
          font-weight: bold !important;
          margin-top: 20px !important;
          font-size: 16px !important;
          background: rgba(59, 130, 246, 0.1) !important;
          padding: 12px 20px !important;
          border-radius: 10px !important;
          display: inline-block !important;
        }
        
        .timer {
          color: #fbbf24 !important;
          font-size: 20px !important;
          font-weight: 800 !important;
        }
        
        .skip-link {
          color: #94a3b8 !important;
          font-size: 14px !important;
          cursor: pointer !important;
          margin-top: 15px !important;
          display: inline-block !important;
          padding: 8px 16px !important;
          border: 1px solid #334155 !important;
          border-radius: 6px !important;
          transition: all 0.2s !important;
        }
        
        .skip-link:hover {
          color: #cbd5e1 !important;
          border-color: #475569 !important;
          background: rgba(71, 85, 105, 0.2) !important;
        }
        
        .video-blocked {
          pointer-events: none !important;
          opacity: 0.2 !important;
          filter: blur(3px) grayscale(0.8) !important;
          transition: all 0.5s !important;
        }
        
        .support-text {
          font-size: 12px !important;
          color: #94a3b8 !important;
          margin-top: 25px !important;
          padding-top: 15px !important;
          border-top: 1px solid #334155 !important;
        }
        
        /* Lock scroll when overlay is active */
        body.affiliate-active {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
        }
      </style>
    `;
    
    // Inject JavaScript untuk affiliate
    const affiliateScript = `
      <script>
        (function() {
          'use strict';
          
          const videoId = '${videoId}';
          const affiliateLink = '${affiliateLink}';
          const storageKey = 'vidstream_affiliate_' + videoId;
          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          
          // Cek jika sudah klik affiliate hari ini
          function hasClickedToday() {
            const data = localStorage.getItem(storageKey);
            if (!data) return false;
            
            try {
              const { timestamp } = JSON.parse(data);
              const now = Date.now();
              return (now - timestamp) < ONE_DAY_MS;
            } catch {
              return false;
            }
          }
          
          // Simpan klik affiliate
          function saveAffiliateClick() {
            const data = {
              timestamp: Date.now(),
              videoId: videoId
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
          }
          
          // Tunggu halaman selesai load
          function initAffiliate() {
            // Cek apakah sudah klik affiliate hari ini
            if (hasClickedToday()) {
              console.log('Affiliate already clicked today');
              return;
            }
            
            // Blokir video elements
            const videoElements = document.querySelectorAll('video, iframe, [src*="vidstrm"], [data-video], .video-player, .player, video#player, #player');
            videoElements.forEach(el => {
              el.classList.add('video-blocked');
            });
            
            // Blokir tombol play
            const playButtons = document.querySelectorAll('button, [onclick*="play"], [class*="play"], [id*="play"]');
            playButtons.forEach(btn => {
              btn.style.pointerEvents = 'none';
              btn.style.opacity = '0.5';
            });
            
            // Buat overlay
            const overlay = document.createElement('div');
            overlay.id = 'affiliateOverlay';
            overlay.innerHTML = \`
              <div id="affiliateContent">
                <div class="affiliate-logo">🎬 ${siteName}</div>
                <div class="affiliate-subtitle">Premium Video Streaming</div>
                
                <h2 class="affiliate-title">Video Ready to Play!</h2>
                
                <div class="affiliate-message">
                  <p>✨ <strong>Thank you for using our free service!</strong></p>
                  <p>To continue watching and support our platform, please visit our sponsor.</p>
                  <p>Your support helps us:</p>
                  <p>• Keep the service free for everyone</p>
                  <p>• Maintain server costs</p>
                  <p>• Add more features</p>
                </div>
                
                <button id="affiliateBtn" class="affiliate-btn">
                  🛍️ Visit Sponsor (Opens in New Tab)
                </button>
                
                <p id="countdown" class="countdown-text">
                  Video will play automatically in <span class="timer" id="timer">5</span> seconds
                </p>
                
                <p id="skipLink" class="skip-link">
                  Skip & Play Directly
                </p>
                
                <div class="support-text">
                  You only need to do this once every 24 hours. Thank you for your support!
                </div>
              </div>
            \`;
            
            document.body.appendChild(overlay);
            document.body.classList.add('affiliate-active');
            
            // Countdown
            let countdown = 5;
            const timerEl = document.getElementById('timer');
            const countdownInterval = setInterval(() => {
              countdown--;
              timerEl.textContent = countdown;
              
              if (countdown <= 0) {
                clearInterval(countdownInterval);
                openAffiliate();
              }
            }, 1000);
            
            // Fungsi buka affiliate
            window.openAffiliate = function() {
              // Buka affiliate di tab baru
              const newTab = window.open(affiliateLink, '_blank', 'noopener,noreferrer');
              
              // Simpan di localStorage
              saveAffiliateClick();
              
              // Hapus overlay setelah delay
              setTimeout(() => {
                if (overlay.parentNode) {
                  overlay.remove();
                }
                document.body.classList.remove('affiliate-active');
                
                // Enable video elements
                videoElements.forEach(el => {
                  el.classList.remove('video-blocked');
                  
                  // Auto play video jika ada
                  if (el.tagName === 'VIDEO') {
                    setTimeout(() => {
                      el.play().catch(e => console.log('Auto-play prevented:', e));
                    }, 500);
                  }
                });
                
                // Enable play buttons
                playButtons.forEach(btn => {
                  btn.style.pointerEvents = '';
                  btn.style.opacity = '';
                });
                
                // Scroll ke video player
                if (videoElements[0]) {
                  videoElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 800); // Delay untuk UX
              
              clearInterval(countdownInterval);
            };
            
            // Event listeners
            document.getElementById('affiliateBtn').addEventListener('click', window.openAffiliate);
            document.getElementById('skipLink').addEventListener('click', function(e) {
              e.preventDefault();
              clearInterval(countdownInterval);
              
              // Tetap simpan klik (tapi tanpa buka affiliate)
              saveAffiliateClick();
              
              // Hapus overlay
              overlay.remove();
              document.body.classList.remove('affiliate-active');
              
              // Enable elements
              videoElements.forEach(el => el.classList.remove('video-blocked'));
              playButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
              });
            });
            
            // Close dengan ESC
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                clearInterval(countdownInterval);
                overlay.remove();
                document.body.classList.remove('affiliate-active');
                videoElements.forEach(el => el.classList.remove('video-blocked'));
                playButtons.forEach(btn => {
                  btn.style.pointerEvents = '';
                  btn.style.opacity = '';
                });
              }
            });
          }
          
          // Tunggu DOM ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAffiliate);
          } else {
            setTimeout(initAffiliate, 500); // Delay sedikit
          }
          
          // Fallback jika ada error
          setTimeout(() => {
            if (document.getElementById('affiliateOverlay') && 
                !localStorage.getItem(storageKey + '_shown')) {
              console.log('Fallback: removing overlay after 30s');
              document.getElementById('affiliateOverlay')?.remove();
              document.body.classList.remove('affiliate-active');
              localStorage.setItem(storageKey + '_shown', 'true');
            }
          }, 30000); // 30 detik timeout
        })();
      </script>
    `;
    
    // ================= INJECT KE HTML =================
    
    // Inject CSS di head
    if (html.includes('</head>')) {
      html = html.replace('</head>', affiliateCSS + '</head>');
    } else {
      html = affiliateCSS + html;
    }
    
    // Inject script sebelum </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', affiliateScript + '</body>');
    } else {
      html = html + affiliateScript;
    }
    
    // ================= FIX LINKS & RESOURCES =================
    
    // Fix relative URLs ke vidstrm.cloud
    html = html.replace(/href="\//g, `href="https://${doodstreamDomain}/`);
    html = html.replace(/src="\//g, `src="https://${doodstreamDomain}/`);
    html = html.replace(/url\(\//g, `url(https://${doodstreamDomain}/`);
    
    // Fix action forms
    html = html.replace(/action="\//g, `action="https://${doodstreamDomain}/`);
    
    // Fix semua link yang masih ke domain lain
    html = html.replace(/doodstream\.com/g, doodstreamDomain);
    html = html.replace(/ds2play\.com/g, doodstreamDomain);
    html = html.replace(/dood\./g, 'vidstrm.');
    
    // ================= SEND RESPONSE =================
    
    // Set headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache 5 menit
    res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=300');
    
    // Send modified HTML
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Fallback page jika error
    const fallbackHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VidStream Player</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            text-align: center; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .error-box { 
            background: rgba(239, 68, 68, 0.1); 
            padding: 30px; 
            border-radius: 15px; 
            margin: 20px; 
            border-left: 4px solid #ef4444;
            max-width: 500px;
          }
          .btn { 
            background: linear-gradient(135deg, #3b82f6, #2563eb); 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-flex; 
            align-items: center;
            gap: 8px;
            margin: 10px; 
            font-weight: 500;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }
          .logo {
            color: #3b82f6;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="logo">🎬 VidStream</div>
        <h1>⚠️ Error Loading Video</h1>
        <div class="error-box">
          <p><strong>Error:</strong> ${error.message}</p>
          <p>Please try one of these options:</p>
          <div style="margin: 20px 0;">
            <a href="/" class="btn">🏠 Go Home</a>
            <button onclick="location.reload()" class="btn">🔄 Retry</button>
            <a href="${process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV'}" target="_blank" class="btn">🛍️ Visit Sponsor</a>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 20px;">
            If the problem persists, please check your video URL.
          </p>
        </div>
      </body>
      </html>
    `;
    
    res.status(500).send(fallbackHtml);
  }
};
