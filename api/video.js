const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Get from query parameters
  const { id } = req.query;
  const path = req.url;
  
  console.log('URL:', path, 'ID:', id);
  
  // ===== ROOT PATH =====
  if (path === '/' || !path || path === '/api/video') {
    const AFFILIATE_LINK = process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV';
    const SITE_NAME = process.env.SITE_NAME || 'Vidoyy';
    const DOOD_DOMAIN = process.env.DOODSTREAM_DOMAIN || 'vidstrm.cloud';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${SITE_NAME}</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial; background: #0f172a; color: white; }
        .container { max-width: 500px; margin: 50px auto; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #475569; 
                border-radius: 8px; background: #1e293b; color: white; }
        button { background: #3b82f6; color: white; padding: 12px 24px; border: none; 
                border-radius: 8px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎬 ${SITE_NAME}</h1>
        <p>Enter vidstrm.cloud URL:</p>
        <input id="url" placeholder="https://vidstrm.cloud/e/abc123">
        <br>
        <button onclick="watch()">Watch</button>
        <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">
          Format: /e/VIDEO_ID or /d/VIDEO_ID
        </p>
      </div>
      <script>
        function watch() {
          const url = document.getElementById('url').value.trim();
          if (!url) return alert('Enter URL');
          
          const match = url.match(/vidstrm\\.cloud\\/(e|d|v)\\/([a-zA-Z0-9]+)/);
          if (!match) {
            alert('Invalid URL');
            return;
          }
          
          const type = match[1];
          const videoId = match[2];
          window.location.href = '/' + type + '/' + videoId;
        }
      </script>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  }
  
  // ===== VIDEO ROUTES: /e/:id, /d/:id, /v/:id =====
  const videoMatch = path.match(/^\/(e|d|v)\/([a-zA-Z0-9]+)/);
  
  if (videoMatch) {
    const type = videoMatch[1];
    const videoId = videoMatch[2];
    
    console.log('Video request:', type, videoId);
    
    const AFFILIATE_LINK = process.env.AFFILIATE_LINK || 'https://doobf.pro/8AQUp3ZesV';
    const DOOD_DOMAIN = process.env.DOODSTREAM_DOMAIN || 'vidstrm.cloud';
    
    try {
      // Fetch original page
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
          if (!localStorage.getItem('vidoyy_${videoId}')) {
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
            \`;
            
            overlay.innerHTML = \`
              <div style="padding: 30px; background: #1a1a1a; border-radius: 10px;">
                <h2>Support Required</h2>
                <p>Click to visit sponsor</p>
                <button id="btn" style="
                  background: #3b82f6;
                  color: white;
                  padding: 12px 24px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin: 15px;
                ">
                  🛍️ Visit
                </button>
              </div>
            \`;
            
            document.body.appendChild(overlay);
            
            function handleClick() {
              window.open('${AFFILIATE_LINK}', '_blank');
              localStorage.setItem('vidoyy_${videoId}', 'true');
              overlay.remove();
              
              // Auto-play video
              setTimeout(() => {
                const video = document.querySelector('video');
                if (video) video.play();
              }, 500);
            }
            
            overlay.addEventListener('click', handleClick);
            document.getElementById('btn').addEventListener('click', handleClick);
          }
        </script>
      `;
      
      // Inject script
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
        <h1>404</h1>
        <p>Not found: ${path}</p>
        <a href="/">Home</a>
      </body>
    </html>
  `);
};
