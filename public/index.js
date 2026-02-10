const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const path = req.url;
  console.log('Request URL:', path);
  
  // Get from environment
  const AFFILIATE_LINK = process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV';
  const SITE_NAME = process.env.SITE_NAME || 'Vidoyy';
  const DOOD_DOMAIN = process.env.DOODSTREAM_DOMAIN || 'vidstrm.cloud';
  
  // ===== ROOT =====
  if (path === '/' || path === '/api' || path === '/api/index.js') {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${SITE_NAME}</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial; background: #0f172a; color: white; }
        .container { max-width: 500px; margin: 50px auto; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #475569; border-radius: 8px; background: #1e293b; color: white; }
        button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎬 ${SITE_NAME}</h1>
        <input id="url" placeholder="Enter video ID (e.g., abc123)" value="demo123">
        <button onclick="watch('e')">Watch /e/</button>
        <button onclick="watch('d')">Watch /d/</button>
        <p>Or try: <a href="/e/demo123">/e/demo123</a> | <a href="/d/test456">/d/test456</a></p>
      </div>
      <script>
        function watch(type) {
          const id = document.getElementById('url').value || 'demo123';
          window.location.href = '/' + type + '/' + id;
        }
      </script>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  }
  
  // ===== VIDEO ROUTES =====
  const match = path.match(/^\/(e|d|v)\/([a-zA-Z0-9]+)$/);
  
  if (match) {
    const type = match[1];
    const videoId = match[2];
    
    console.log('Video:', type, videoId);
    
    try {
      // Fetch from vidstrm
      const targetUrl = `https://${DOOD_DOMAIN}/${type}/${videoId}`;
      console.log('Fetching:', targetUrl);
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }
      
      let html = await response.text();
      
      // Simple affiliate injection
      const affiliateScript = `
        <script>
          // Wait for page load
          window.addEventListener('load', function() {
            const videoId = '${videoId}';
            const affiliateLink = '${AFFILIATE_LINK}';
            const storageKey = 'vidoyy_' + videoId;
            
            // Check 24h
            const oneDay = 24 * 60 * 60 * 1000;
            const data = localStorage.getItem(storageKey);
            let hasClicked = false;
            
            if (data) {
              try {
                const { timestamp } = JSON.parse(data);
                hasClicked = (Date.now() - timestamp) < oneDay;
              } catch(e) {}
            }
            
            if (!hasClicked) {
              // Add overlay
              const overlay = document.createElement('div');
              overlay.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 999999;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                padding: 20px;
              \`;
              
              overlay.innerHTML = \`
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 2px solid #3b82f6;">
                  <h2>Click to Support</h2>
                  <p>Video will play after visiting sponsor</p>
                  <button style="
                    background: #3b82f6;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 15px;
                  ">
                    🛍️ Visit Sponsor
                  </button>
                  <p>Auto in <span id="count">5</span>s</p>
                </div>
              \`;
              
              document.body.appendChild(overlay);
              
              // Countdown
              let seconds = 5;
              const timer = setInterval(() => {
                seconds--;
                document.getElementById('count').textContent = seconds;
                if (seconds <= 0) {
                  clearInterval(timer);
                  handleClick();
                }
              }, 1000);
              
              function handleClick() {
                window.open(affiliateLink, '_blank');
                localStorage.setItem(storageKey, JSON.stringify({
                  timestamp: Date.now(),
                  videoId: videoId
                }));
                overlay.remove();
                clearInterval(timer);
                
                // Try to play video
                setTimeout(() => {
                  const video = document.querySelector('video');
                  if (video) video.play();
                }, 500);
              }
              
              overlay.addEventListener('click', handleClick);
            }
          });
        </script>
      `;
      
      // Inject
      if (html.includes('</body>')) {
        html = html.replace('</body>', affiliateScript + '</body>');
      }
      
      // Fix URLs
      html = html.replace(/href="\//g, `href="https://${DOOD_DOMAIN}/`);
      html = html.replace(/src="\//g, `src="https://${DOOD_DOMAIN}/`);
      
      res.setHeader('Content-Type', 'text/html');
      return res.end(html);
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>Error</h1>
            <p>${error.message}</p>
            <a href="/">Home</a>
          </body>
        </html>
      `);
    }
  }
  
  // ===== 404 =====
  res.status(404).send(`
    <html>
      <body style="font-family: Arial; padding: 40px; text-align: center;">
        <h1>404 - ${path}</h1>
        <p>Try: <a href="/">Home</a> or <a href="/e/demo123">/e/demo123</a></p>
      </body>
    </html>
  `);
};
