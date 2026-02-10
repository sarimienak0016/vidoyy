// File: index.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const path = req.url || '/';
  
  // ===== ROOT =====
  if (path === '/') {
    return res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy - Watch Videos</title>
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
            max-width: 500px;
            width: 100%;
            background: rgba(30, 41, 59, 0.9);
            padding: 40px;
            border-radius: 20px;
            border: 2px solid #3b82f6;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          }
          h1 {
            color: #3b82f6;
            margin-bottom: 20px;
            font-size: 36px;
          }
          input {
            width: 100%;
            padding: 15px;
            margin: 15px 0;
            border: 2px solid #475569;
            border-radius: 10px;
            background: rgba(15, 23, 42, 0.8);
            color: white;
            font-size: 16px;
          }
          button {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 16px 40px;
            font-size: 18px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            margin: 10px;
            transition: all 0.3s;
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
          }
          .example {
            background: rgba(59, 130, 246, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-top: 25px;
            text-align: left;
            font-size: 14px;
            border-left: 4px solid #3b82f6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎬 Vidoyy</h1>
          <p>Enter Video ID from vidstrm.cloud:</p>
          
          <input type="text" id="videoId" placeholder="e.g., abc123xyz" value="demo123">
          
          <div>
            <button onclick="watch('e')">Watch /e/</button>
            <button onclick="watch('d')">Watch /d/</button>
          </div>
          
          <div class="example">
            <strong>Test Links:</strong><br>
            • <a href="/e/demo123" style="color: #60a5fa;">/e/demo123</a><br>
            • <a href="/d/test456" style="color: #60a5fa;">/d/test456</a><br>
            • <a href="/v/example" style="color: #60a5fa;">/v/example</a>
          </div>
        </div>
        
        <script>
          function watch(type) {
            const videoId = document.getElementById('videoId').value.trim() || 'demo123';
            window.location.href = '/' + type + '/' + videoId;
          }
          
          // Enter key support
          document.getElementById('videoId').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') watch('e');
          });
        </script>
      </body>
      </html>
    `);
  }
  
  // ===== VIDEO ROUTES =====
  const match = path.match(/^\/(e|d|v)\/([a-zA-Z0-9]+)/);
  
  if (match) {
    const type = match[1];
    const videoId = match[2];
    
    console.log(`🎥 Loading video: ${type}/${videoId}`);
    
    try {
      // Fetch from vidstrm.cloud
      const targetUrl = `https://vidstrm.cloud/${type}/${videoId}`;
      console.log('🌐 Fetching:', targetUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      let html = await response.text();
      
      // ===== AFFILIATE INJECTION =====
      const affiliateScript = `
        <!-- Vidoyy Affiliate Injection -->
        <style>
          #vidoyyAffiliateOverlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.95) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            text-align: center !important;
            font-family: Arial, sans-serif !important;
          }
          
          #vidoyyAffiliateContent {
            max-width: 500px !important;
            background: rgba(30, 30, 30, 0.95) !important;
            padding: 40px !important;
            border-radius: 20px !important;
            border: 3px solid #3b82f6 !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important;
            backdrop-filter: blur(10px) !important;
          }
          
          .vidoyy-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
            color: white !important;
            border: none !important;
            padding: 18px 40px !important;
            font-size: 18px !important;
            border-radius: 50px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            margin: 25px 0 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            width: 100% !important;
            max-width: 350px !important;
            transition: all 0.3s !important;
          }
          
          .vidoyy-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6) !important;
          }
          
          .vidoyy-countdown {
            color: #60a5fa !important;
            font-weight: bold !important;
            margin-top: 20px !important;
            font-size: 16px !important;
          }
        </style>
        
        <div id="vidoyyAffiliateOverlay">
          <div id="vidoyyAffiliateContent">
            <div style="font-size: 48px; margin-bottom: 15px;">🎬</div>
            <h2 style="color: #3b82f6; margin-bottom: 15px; font-size: 28px;">Support Required</h2>
            
            <div style="
              background: rgba(59, 130, 246, 0.15);
              padding: 20px;
              border-radius: 12px;
              margin: 25px 0;
              border-left: 4px solid #3b82f6;
              text-align: left;
            ">
              <p style="margin: 10px 0; font-size: 16px;">🎥 <strong>Your video is ready!</strong></p>
              <p style="margin: 10px 0; color: #94a3b8;">Please support our free service by visiting our sponsor.</p>
              <p style="margin: 10px 0; color: #94a3b8; font-size: 14px;">This helps keep the platform running for everyone.</p>
            </div>
            
            <button id="vidoyyAffiliateBtn" class="vidoyy-btn">
              🛍️ Visit Sponsor (Opens in New Tab)
            </button>
            
            <p id="vidoyyCountdown" class="vidoyy-countdown">
              Video will play automatically in <span id="vidoyyTimer" style="color: #fbbf24; font-size: 20px;">5</span> seconds
            </p>
            
            <p id="vidoyySkipBtn" style="
              color: #94a3b8;
              margin-top: 15px;
              cursor: pointer;
              padding: 8px 16px;
              border: 1px solid #334155;
              border-radius: 6px;
              display: inline-block;
              font-size: 14px;
            ">
              Skip to video
            </p>
          </div>
        </div>
        
        <script>
          (function() {
            'use strict';
            
            const videoId = '${videoId}';
            const affiliateLink = 'https://doobf.pro/8AQUp3ZesV';
            const storageKey = 'vidoyy_' + videoId;
            const oneDay = 24 * 60 * 60 * 1000;
            
            // Check if already clicked today
            let hasClicked = false;
            const savedData = localStorage.getItem(storageKey);
            
            if (savedData) {
              try {
                const { timestamp } = JSON.parse(savedData);
                hasClicked = (Date.now() - timestamp) < oneDay;
              } catch(e) {
                console.log('Error parsing storage');
              }
            }
            
            if (hasClicked) {
              console.log('Already supported today');
              document.getElementById('vidoyyAffiliateOverlay').remove();
              return;
            }
            
            // Countdown timer
            let seconds = 5;
            const timerEl = document.getElementById('vidoyyTimer');
            const countdownInterval = setInterval(() => {
              seconds--;
              timerEl.textContent = seconds;
              
              if (seconds <= 0) {
                clearInterval(countdownInterval);
                handleAffiliateClick();
              }
            }, 1000);
            
            // Handle affiliate click
            function handleAffiliateClick() {
              console.log('Opening affiliate...');
              
              // Open affiliate in new tab
              window.open(affiliateLink, '_blank', 'noopener,noreferrer');
              
              // Save to localStorage
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: videoId
              }));
              
              // Remove overlay
              const overlay = document.getElementById('vidoyyAffiliateOverlay');
              if (overlay) overlay.remove();
              
              // Clear interval
              clearInterval(countdownInterval);
              
              // Try to auto-play video
              setTimeout(() => {
                const videoElement = document.querySelector('video');
                if (videoElement) {
                  videoElement.play().catch(error => {
                    console.log('Auto-play blocked:', error);
                    // Add manual play button if needed
                    if (error.name === 'NotAllowedError') {
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
                        z-index: 999999;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                      \`;
                      playBtn.onclick = () => {
                        videoElement.play();
                        playBtn.remove();
                      };
                      document.body.appendChild(playBtn);
                    }
                  });
                }
              }, 800);
            }
            
            // Event listeners
            document.getElementById('vidoyyAffiliateBtn').addEventListener('click', handleAffiliateClick);
            
            document.getElementById('vidoyySkipBtn').addEventListener('click', function() {
              clearInterval(countdownInterval);
              localStorage.setItem(storageKey, JSON.stringify({
                timestamp: Date.now(),
                videoId: videoId
              }));
              document.getElementById('vidoyyAffiliateOverlay').remove();
            });
            
            // Fallback: Auto-remove after 30 seconds
            setTimeout(() => {
              if (document.getElementById('vidoyyAffiliateOverlay')) {
                clearInterval(countdownInterval);
                document.getElementById('vidoyyAffiliateOverlay').remove();
                localStorage.setItem(storageKey, JSON.stringify({
                  timestamp: Date.now(),
                  videoId: videoId
                }));
              }
            }, 30000);
            
          })();
        </script>
      `;
      
      // Inject the affiliate script into the HTML
      // We'll add it at the beginning of the body
      if (html.includes('<body')) {
        // Find body tag and inject right after it
        html = html.replace('<body', '<body style="position: relative;"');
        
        // Add affiliate injection
        const bodyEnd = html.indexOf('>', html.indexOf('<body')) + 1;
        html = html.slice(0, bodyEnd) + affiliateScript + html.slice(bodyEnd);
      } else {
        // If no body tag, just append
        html = affiliateScript + html;
      }
      
      // Fix relative URLs
      html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
      html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
      html = html.replace(/url\(\//g, 'url(https://vidstrm.cloud/');
      
      // Set response headers
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      
      console.log('✅ Sending modified page');
      return res.end(html);
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.end(`
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
          <h1>🎬 Vidoyy</h1>
          <div class="error">
            <h3>⚠️ Error Loading Video</h3>
            <p><strong>${error.message}</strong></p>
            <p>Please check the video ID or try again later.</p>
            <a href="/" class="btn">Go Home</a>
            <a href="https://doobf.pro/8AQUp3ZesV" target="_blank" class="btn">Visit Sponsor</a>
          </div>
        </body>
        </html>
      `);
    }
  }
  
  // ===== 404 =====
  res.status(404).end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Vidoyy</title>
      <style>
        body { font-family: Arial; padding: 40px; text-align: center; background: #0f172a; color: white; }
        h1 { color: #ef4444; }
        .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>Path: ${path}</p>
      <p><a href="/" class="btn">Go Home</a></p>
    </body>
    </html>
  `);
};
