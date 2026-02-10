const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Extract path from URL
  const path = req.url.replace('/api', '').replace(/^\//, '');
  
  console.log('Request URL:', req.url, 'Path:', path);
  
  // Handle root - serve landing page
  if (req.url === '/' || req.url === '/api' || path === '') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vidoyy - Free Video Streaming</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          width: 100%;
          background: rgba(30, 41, 59, 0.9);
          padding: 40px;
          border-radius: 20px;
          border: 2px solid #3b82f6;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          text-align: center;
        }
        .logo {
          font-size: 48px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 28px;
        }
        input {
          width: 100%;
          padding: 16px;
          background: rgba(15, 23, 42, 0.8);
          border: 2px solid #475569;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          margin: 20px 0;
        }
        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 18px 40px;
          font-size: 18px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          transition: all 0.3s;
        }
        button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }
        .example {
          background: rgba(59, 130, 246, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          text-align: left;
          font-size: 14px;
          border-left: 4px solid #3b82f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🎬 Vidoyy</div>
        <h1>Free HD Video Streaming</h1>
        <p>Paste any vidstrm.cloud video link below:</p>
        
        <input type="text" id="videoUrl" 
               placeholder="https://vidstrm.cloud/e/abc123xyz"
               value="https://vidstrm.cloud/e/demo123">
        
        <button onclick="watchVideo()">
          ▶️ Watch Video Now
        </button>
        
        <div class="example">
          <strong>Examples:</strong><br>
          • https://vidstrm.cloud/e/abc123<br>
          • https://vidstrm.cloud/d/def456<br>
          • https://vidstrm.cloud/v/ghi789
        </div>
      </div>
      
      <script>
        function watchVideo() {
          const url = document.getElementById('videoUrl').value.trim();
          if (!url) return alert('Please enter a URL');
          
          // Extract video ID
          const match = url.match(/vidstrm\\.cloud\\/(e|d|v)\\/([a-zA-Z0-9]+)/);
          if (!match) return alert('Invalid URL format');
          
          // Redirect to our proxy
          window.location.href = '/' + match[1] + '/' + match[2];
        }
        
        // Enter key support
        document.getElementById('videoUrl').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') watchVideo();
        });
      </script>
    </body>
    </html>`;
    return res.end(html);
  }
  
  // Handle video URLs: /e/xxx, /d/xxx, /v/xxx
  const videoMatch = path.match(/^(e|d|v)\/([a-zA-Z0-9]+)/);
  if (videoMatch) {
    const type = videoMatch[1];
    const videoId = videoMatch[2];
    
    try {
      // Fetch from vidstrm.cloud
      const targetUrl = `https://vidstrm.cloud/${type}/${videoId}`;
      console.log('Fetching from:', targetUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      let html = await response.text();
      
      // ===== INJECT AFFILIATE =====
      const affiliateScript = `
      <script>
        // Vidoyy Affiliate Injection
        (function() {
          const storageKey = 'vidoyy_aff_${videoId}';
          const ONE_DAY = 24 * 60 * 60 * 1000;
          
          // Check if clicked in last 24 hours
          function hasClickedToday() {
            const data = localStorage.getItem(storageKey);
            if (!data) return false;
            try {
              const { timestamp } = JSON.parse(data);
              return (Date.now() - timestamp) < ONE_DAY;
            } catch {
              return false;
            }
          }
          
          if (!hasClickedToday()) {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'vidoyyAffiliateOverlay';
            overlay.style.cssText = \`
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: rgba(0,0,0,0.98) !important;
              z-index: 999999 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              color: white !important;
              text-align: center !important;
              padding: 20px !important;
              font-family: Arial, sans-serif !important;
            \`;
            
            overlay.innerHTML = \`
              <div style="
                max-width: 500px;
                background: rgba(20,20,20,0.95);
                padding: 40px;
                border-radius: 20px;
                border: 2px solid #3b82f6;
                box-shadow: 0 20px 60px rgba(0,0,0,0.7);
              ">
                <div style="color: #3b82f6; font-size: 36px; font-weight: bold; margin-bottom: 15px;">
                  🎬 Vidoyy
                </div>
                <h2 style="margin-bottom: 20px;">Video Ready to Play!</h2>
                
                <div style="
                  background: rgba(59, 130, 246, 0.15);
                  padding: 20px;
                  border-radius: 12px;
                  margin: 25px 0;
                  border-left: 4px solid #3b82f6;
                  text-align: left;
                ">
                  <p>Please support our free service by visiting our sponsor.</p>
                  <p><small>Your support helps keep this platform running for everyone.</small></p>
                </div>
                
                <button id="vidoyyAffBtn" style="
                  background: linear-gradient(135deg, #3b82f6, #2563eb);
                  color: white;
                  border: none;
                  padding: 18px 40px;
                  font-size: 18px;
                  border-radius: 50px;
                  cursor: pointer;
                  margin: 20px 0;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                  width: 100%;
                ">
                  🛍️ Visit Sponsor (Opens in New Tab)
                </button>
                
                <p id="vidoyyCountdown" style="color: #60a5fa; font-weight: bold; margin-top: 20px;">
                  Auto-play in <span id="vidoyyTimer">5</span> seconds
                </p>
                
                <p id="vidoyySkipBtn" style="
                  color: #94a3b8;
                  margin-top: 15px;
                  cursor: pointer;
                  padding: 8px 16px;
                  border: 1px solid #334155;
                  border-radius: 8px;
                  display: inline-block;
                ">
                  Skip to video
                </p>
              </div>
            \`;
            
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            // Block video elements
            document.querySelectorAll('video, iframe').forEach(el => {
              el.style.pointerEvents = 'none';
              el.style.opacity = '0.3';
              el.style.filter = 'blur(3px)';
            });
            
            // Countdown
            let seconds = 5;
            const timerEl = document.getElementById('vidoyyTimer');
            const timerInterval = setInterval(() => {
              seconds--;
              timerEl.textContent = seconds;
              if (seconds <= 0) {
                clearInterval(timerInterval);
                handleAffiliateClick();
              }
            }, 1000);
            
            function handleAffiliateClick() {
              // Open affiliate
              window.open('https://doobf.pro/8AQUp3ZesV', '_blank', 'noopener,noreferrer');
              
              // Save to localStorage
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: '${videoId}'
              }));
              
              // Remove overlay
              overlay.remove();
              document.body.style.overflow = '';
              
              // Enable video
              document.querySelectorAll('video, iframe').forEach(el => {
                el.style.pointerEvents = '';
                el.style.opacity = '';
                el.style.filter = '';
              });
              
              // Auto play
              const video = document.querySelector('video');
              if (video) {
                setTimeout(() => video.play().catch(() => {}), 500);
              }
              
              clearInterval(timerInterval);
            }
            
            document.getElementById('vidoyyAffBtn').onclick = handleAffiliateClick;
            document.getElementById('vidoyySkipBtn').onclick = function() {
              clearInterval(timerInterval);
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: '${videoId}'
              }));
              overlay.remove();
              document.body.style.overflow = '';
              document.querySelectorAll('video, iframe').forEach(el => {
                el.style.pointerEvents = '';
                el.style.opacity = '';
                el.style.filter = '';
              });
            };
          }
        })();
      </script>`;
      
      // Inject into HTML
      if (html.includes('</body>')) {
        html = html.replace('</body>', affiliateScript + '</body>');
      } else {
        html = html + affiliateScript;
      }
      
      // Fix relative URLs
      html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
      html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
      
      res.setHeader('Content-Type', 'text/html');
      return res.end(html);
      
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>Vidoyy - Error</h1>
            <div style="background: #fee; padding: 20px; border-radius: 10px; margin: 20px;">
              <p><strong>Error:</strong> ${error.message}</p>
              <p>Please try again or contact support.</p>
              <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px;">
                Go Home
              </a>
            </div>
          </body>
        </html>
      `);
    }
  }
  
  // 404 for everything else
  res.status(404).send(`
    <html>
      <body style="font-family: Arial; padding: 40px; text-align: center;">
        <h1>404 - Page Not Found</h1>
        <p>The requested URL was not found on this server.</p>
        <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; 
           text-decoration: none; border-radius: 5px;">
          Go Home
        </a>
      </body>
    </html>
  `);
};
