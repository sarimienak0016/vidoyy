const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Get environment variables
  const AFFILIATE_LINK = process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV';
  const SITE_NAME = process.env.SITE_NAME || 'Vidoyy';
  const DOOD_DOMAIN = process.env.DOODSTREAM_DOMAIN || 'vidstrm.cloud';
  
  const { url } = req;
  console.log('Request URL:', url);
  
  // ===== ROOT PATH =====
  if (url === '/' || url === '/api/video') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${SITE_NAME} - Watch Videos</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 20px; font-family: Arial; background: #0f172a; color: white; text-align: center; }
        .container { max-width: 500px; margin: 50px auto; }
        input { width: 100%; padding: 15px; margin: 15px 0; border: 2px solid #475569; border-radius: 10px; background: #1e293b; color: white; font-size: 16px; }
        button { background: #3b82f6; color: white; padding: 16px 40px; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin: 10px; }
        .example { background: rgba(59,130,246,0.1); padding: 15px; border-radius: 10px; margin-top: 20px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #3b82f6; font-size: 42px;">🎬 ${SITE_NAME}</h1>
        <p>Watch videos from ${DOOD_DOMAIN}</p>
        
        <input type="text" id="videoUrl" placeholder="https://${DOOD_DOMAIN}/e/abc123" value="https://${DOOD_DOMAIN}/e/demo">
        
        <button onclick="watchVideo()">▶️ Watch Video</button>
        
        <div class="example">
          <strong>Examples:</strong><br>
          • https://${DOOD_DOMAIN}/e/abc123xyz<br>
          • https://${DOOD_DOMAIN}/d/def456uvw<br>
          • https://${DOOD_DOMAIN}/v/ghi789rst
        </div>
      </div>
      
      <script>
        function watchVideo() {
          const url = document.getElementById('videoUrl').value.trim();
          if (!url) return alert('Enter video URL');
          
          // Extract video ID
          const match = url.match(/https?:\\/\\/${DOOD_DOMAIN.replace('.', '\\.')}\\/(e|d|v)\\/([a-zA-Z0-9]+)/);
          if (!match) {
            alert('Invalid URL. Use: https://${DOOD_DOMAIN}/e/VIDEO_ID');
            return;
          }
          
          const type = match[1];
          const videoId = match[2];
          
          // Redirect to watch page
          window.location.href = '/watch/' + type + '/' + videoId;
        }
        
        // Enter key support
        document.getElementById('videoUrl').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') watchVideo();
        });
      </script>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  }
  
  // ===== WATCH ROUTE =====
  if (url.startsWith('/watch/')) {
    const parts = url.split('/');
    const type = parts[2]; // e, d, or v
    const videoId = parts[3];
    
    if (!type || !videoId) {
      return res.redirect('/');
    }
    
    try {
      // Fetch original page
      const targetUrl = `https://${DOOD_DOMAIN}/${type}/${videoId}`;
      console.log('Fetching original:', targetUrl);
      
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
      
      // Inject affiliate script
      const affiliateScript = `
        <script>
          (function() {
            'use strict';
            
            const videoId = '${videoId}';
            const affiliateLink = '${AFFILIATE_LINK}';
            const siteName = '${SITE_NAME}';
            const storageKey = siteName + '_' + videoId;
            
            // Check 24-hour cookie
            function hasClickedToday() {
              const data = localStorage.getItem(storageKey);
              if (!data) return false;
              try {
                const { timestamp } = JSON.parse(data);
                const oneDay = 24 * 60 * 60 * 1000;
                return (Date.now() - timestamp) < oneDay;
              } catch(e) {
                return false;
              }
            }
            
            // Initialize after page loads
            function init() {
              if (hasClickedToday()) {
                console.log('Already supported today');
                return;
              }
              
              console.log('Adding click-to-affiliate overlay');
              
              // Create overlay
              const overlay = document.createElement('div');
              overlay.id = 'affiliateOverlay';
              overlay.style.cssText = \`
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
                color: white;
                text-align: center;
                padding: 20px;
                font-family: Arial, sans-serif;
              \`;
              
              overlay.innerHTML = \`
                <div style="
                  max-width: 500px;
                  background: #1a1a1a;
                  padding: 40px;
                  border-radius: 20px;
                  border: 3px solid #3b82f6;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                ">
                  <div style="font-size: 48px; margin-bottom: 15px;">🎬</div>
                  <h2 style="color: #3b82f6; margin-bottom: 20px;">\${siteName}</h2>
                  <p style="font-size: 20px; margin-bottom: 30px;">Click to Support & Play</p>
                  
                  <div style="
                    background: rgba(59,130,246,0.2);
                    padding: 20px;
                    border-radius: 12px;
                    margin: 25px 0;
                    border-left: 4px solid #3b82f6;
                    text-align: left;
                  ">
                    <p>• Support opens in new tab</p>
                    <p>• Video plays automatically</p>
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
                    margin: 20px 0;
                    width: 100%;
                    max-width: 350px;
                  ">
                    🛍️ Click to Support
                  </button>
                  
                  <p style="color: #94a3b8; margin-top: 20px;">
                    Auto-continue in <span id="countdown">5</span> seconds
                  </p>
                </div>
              \`;
              
              document.body.appendChild(overlay);
              document.body.style.overflow = 'hidden';
              
              // Countdown
              let seconds = 5;
              const countdownEl = document.getElementById('countdown');
              const timer = setInterval(() => {
                seconds--;
                countdownEl.textContent = seconds;
                if (seconds <= 0) {
                  clearInterval(timer);
                  handleClick();
                }
              }, 1000);
              
              // Click handler
              function handleClick() {
                // Open affiliate
                window.open(affiliateLink, '_blank', 'noopener,noreferrer');
                
                // Save to localStorage
                localStorage.setItem(storageKey, JSON.stringify({
                  timestamp: Date.now(),
                  videoId: videoId
                }));
                
                // Remove overlay
                overlay.remove();
                document.body.style.overflow = '';
                clearInterval(timer);
                
                // Auto-play video
                setTimeout(() => {
                  const video = document.querySelector('video');
                  if (video) {
                    video.play().catch(e => console.log('Auto-play blocked'));
                  }
                }, 800);
              }
              
              // Event listeners
              overlay.addEventListener('click', handleClick);
              document.getElementById('supportBtn').addEventListener('click', handleClick);
              
              // Fallback after 30s
              setTimeout(() => {
                if (document.getElementById('affiliateOverlay')) {
                  overlay.remove();
                  document.body.style.overflow = '';
                  clearInterval(timer);
                }
              }, 30000);
            }
            
            // Start
            if (document.readyState === 'complete') {
              setTimeout(init, 1000);
            } else {
              window.addEventListener('load', function() {
                setTimeout(init, 1500);
              });
            }
          })();
        </script>
      `;
      
      // Inject script
      if (html.includes('</body>')) {
        html = html.replace('</body>', affiliateScript + '</body>');
      } else {
        html = html + affiliateScript;
      }
      
      // Fix relative URLs
      html = html.replace(/href="\//g, `href="https://${DOOD_DOMAIN}/`);
      html = html.replace(/src="\//g, `src="https://${DOOD_DOMAIN}/`);
      
      res.setHeader('Content-Type', 'text/html');
      return res.end(html);
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>Error Loading Video</h1>
            <p>${error.message}</p>
            <a href="/" style="
              background: #3b82f6;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
            ">Go Home</a>
          </body>
        </html>
      `);
    }
  }
  
  // ===== 404 FOR OTHER ROUTES =====
  res.status(404).send(`
    <html>
      <body style="font-family: Arial; padding: 40px; text-align: center;">
        <h1>404 - Page Not Found</h1>
        <p>URL: ${url}</p>
        <a href="/" style="
          background: #3b82f6;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        ">Go Home</a>
      </body>
    </html>
  `);
};
