const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Extract video type and ID from path
  const path = req.url;
  
  console.log('Request URL:', req.url);
  
  // Handle root - show simple input form
  if (path === '/' || path === '/api/video') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vidoyy - Watch Videos</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; background: #0f172a; color: white; text-align: center; }
        .container { max-width: 500px; margin: 50px auto; }
        input { width: 100%; padding: 15px; margin: 10px 0; border: 2px solid #475569; border-radius: 8px; background: #1e293b; color: white; }
        button { background: #3b82f6; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎬 Vidoyy</h1>
        <p>Paste vidstrm.cloud video URL:</p>
        <input id="url" placeholder="https://vidstrm.cloud/e/abc123" value="https://vidstrm.cloud/e/demo">
        <br>
        <button onclick="watch()">Watch Video</button>
        <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">
          Example: https://vidstrm.cloud/e/abc123xyz
        </p>
      </div>
      <script>
        function watch() {
          const url = document.getElementById('url').value.trim();
          const match = url.match(/vidstrm\\.cloud\\/(e|d|v)\\/([a-zA-Z0-9]+)/);
          if (match) {
            window.location.href = '/watch/' + match[1] + '/' + match[2];
          } else {
            alert('Invalid URL. Use: https://vidstrm.cloud/e/VIDEO_ID');
          }
        }
      </script>
    </body>
    </html>`;
    return res.end(html);
  }
  
  // Handle video watch route: /watch/[type]/[id]
  if (path.startsWith('/watch/')) {
    const parts = path.split('/');
    const type = parts[2]; // e, d, or v
    const videoId = parts[3];
    
    if (!type || !videoId) {
      return res.redirect('/');
    }
    
    try {
      // Fetch original vidstrm page
      const targetUrl = `https://vidstrm.cloud/${type}/${videoId}`;
      console.log('Fetching:', targetUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      let html = await response.text();
      
      // Inject affiliate script
      const affiliateScript = `
        <script>
          (function() {
            const videoId = '${videoId}';
            const affiliateLink = 'https://doobf.pro/8AQUp3ZesV';
            const storageKey = 'vidoyy_' + videoId;
            
            // Check 24-hour cookie
            function hasClickedToday() {
              const data = localStorage.getItem(storageKey);
              if (!data) return false;
              try {
                const { timestamp } = JSON.parse(data);
                const oneDay = 24 * 60 * 60 * 1000;
                return (Date.now() - timestamp) < oneDay;
              } catch {
                return false;
              }
            }
            
            // Wait for page to load
            window.addEventListener('load', function() {
              if (hasClickedToday()) {
                console.log('Already clicked today');
                return;
              }
              
              // Create overlay
              const overlay = document.createElement('div');
              overlay.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                padding: 20px;
              \`;
              
              overlay.innerHTML = \`
                <div style="max-width: 500px; padding: 30px; background: #1a1a1a; border-radius: 15px; border: 2px solid #3b82f6;">
                  <h2>Click to Support & Play</h2>
                  <p>Please support our free service</p>
                  <button id="supportBtn" style="
                    background: #3b82f6;
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    margin: 20px;
                    font-size: 16px;
                  ">
                    🛍️ Visit Sponsor
                  </button>
                  <p>Video will play after support</p>
                </div>
              \`;
              
              document.body.appendChild(overlay);
              document.body.style.overflow = 'hidden';
              
              // Click handler
              function handleClick() {
                window.open(affiliateLink, '_blank');
                localStorage.setItem(storageKey, JSON.stringify({
                  timestamp: Date.now(),
                  videoId: videoId
                }));
                overlay.remove();
                document.body.style.overflow = '';
                
                // Auto-play video
                setTimeout(() => {
                  const video = document.querySelector('video');
                  if (video) video.play();
                }, 500);
              }
              
              overlay.addEventListener('click', handleClick);
              document.getElementById('supportBtn').addEventListener('click', handleClick);
            });
          })();
        </script>
      `;
      
      // Inject script
      if (html.includes('</body>')) {
        html = html.replace('</body>', affiliateScript + '</body>');
      }
      
      // Fix URLs
      html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
      html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
      
      res.setHeader('Content-Type', 'text/html');
      return res.end(html);
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>Error</h1>
            <p>${error.message}</p>
            <a href="/">Go Home</a>
          </body>
        </html>
      `);
    }
  }
  
  // 404 for other routes
  res.status(404).send('404 Not Found');
};
