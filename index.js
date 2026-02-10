const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const path = req.url || '/';
  console.log(`📨 Request: ${path}`);
  
  // ===== ROOT =====
  if (path === '/') {
    console.log('🏠 Serving root page');
    return res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; }
          .debug { background: #f0f0f0; padding: 10px; margin: 10px; }
        </style>
      </head>
      <body>
        <h1>🎬 Vidoyy DEBUG</h1>
        <div class="debug">
          <p>Test Links:</p>
          <a href="/e/test123">/e/test123</a><br>
          <a href="/d/test456">/d/test456</a>
        </div>
        <p>Check browser console after clicking!</p>
      </body>
      </html>
    `);
  }
  
  // ===== VIDEO ROUTES =====
  const match = path.match(/^\/(e|d|v)\/(.+)$/);
  
  if (match) {
    const type = match[1];
    const videoId = match[2];
    const DOOD_URL = `https://vidstrm.cloud/${type}/${videoId}`;
    const AFFILIATE_LINK = 'https://doobf.pro/8AQUp3ZesV';
    
    console.log(`🎬 Video: ${type}/${videoId}`);
    console.log(`🌐 Doodstream: ${DOOD_URL}`);
    
    try {
      // 1. FETCH DOODSTREAM PAGE
      console.log('⏳ Fetching Doodstream page...');
      const response = await fetch(DOOD_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        console.error(`❌ Fetch failed: ${response.status}`);
        throw new Error(`HTTP ${response.status}`);
      }
      
      let html = await response.text();
      console.log('✅ Doodstream page fetched');
      
      // 2. INJECT DEBUG SCRIPT
      const debugScript = `
        <!-- ===== VIDOYY DEBUG INJECTION ===== -->
        <script>
          console.log('🔧 Vidoyy script injected!');
          console.log('📱 User Agent:', navigator.userAgent);
          console.log('📱 Platform:', navigator.platform);
          
          // Simple alert test
          document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ DOM fully loaded');
            
            // Make entire page clickable
            document.body.style.cursor = 'pointer';
            
            // Add click listener to body
            document.body.addEventListener('click', function(e) {
              console.log('🖱️ Body clicked!', e.clientX, e.clientY);
              alert('Click worked! Opening Shopee...');
              
              // Try to open Shopee app
              const shopeeLink = 'https://doobf.pro/8AQUp3ZesV';
              
              // For mobile apps
              if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                console.log('📱 Mobile device detected');
                // Try app deep link first
                window.location.href = 'shopee://doobf.pro/8AQUp3ZesV';
                
                // Fallback to web after 500ms
                setTimeout(function() {
                  window.location.href = shopeeLink;
                }, 500);
              } else {
                // Desktop - open in new tab
                console.log('💻 Desktop detected');
                window.open(shopeeLink, '_blank');
              }
              
              // Redirect to doodstream after 2 seconds
              setTimeout(function() {
                console.log('🔄 Redirecting to Doodstream...');
                window.location.href = '${DOOD_URL}';
              }, 2000);
              
              e.preventDefault();
              e.stopPropagation();
            });
            
            // Add visual indicator
            const indicator = document.createElement('div');
            indicator.innerHTML = '🟢 CLICK ANYWHERE TO CONTINUE';
            indicator.style.cssText = \`
              position: fixed;
              bottom: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              padding: 15px;
              border-radius: 10px;
              z-index: 999999;
              font-weight: bold;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
              cursor: pointer;
            \`;
            document.body.appendChild(indicator);
            
            console.log('🎯 Page is now clickable!');
          });
          
          // Fallback if DOM already loaded
          if (document.readyState === 'complete') {
            console.log('⚡ DOM already complete, firing event');
            document.dispatchEvent(new Event('DOMContentLoaded'));
          }
        </script>
        <!-- ===== END DEBUG ===== -->
      `;
      
      // 3. INJECT SCRIPT
      if (html.includes('</body>')) {
        html = html.replace('</body>', debugScript + '</body>');
      } else {
        html = html + debugScript;
      }
      
      // 4. FIX URLS
      html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
      html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
      
      // 5. SEND RESPONSE
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      console.log('🚀 Sending page with injected script');
      return res.end(html);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      
      // Error page with manual redirect
      const errorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error - Vidoyy</title>
          <style>
            body { font-family: Arial; padding: 40px; text-align: center; }
            button { background: #3b82f6; color: white; padding: 15px 30px; border: none; cursor: pointer; margin: 10px; }
          </style>
        </head>
        <body>
          <h1>⚠️ Error Loading Video</h1>
          <p>${error.message}</p>
          <button onclick="openShopee()">Open Shopee App</button>
          <button onclick="redirectToVideo()">Go to Video</button>
          <script>
            function openShopee() {
              alert('Opening Shopee...');
              window.location.href = 'https://doobf.pro/8AQUp3ZesV';
              setTimeout(() => {
                window.location.href = '${DOOD_URL}';
              }, 2000);
            }
            function redirectToVideo() {
              window.location.href = '${DOOD_URL}';
            }
          </script>
        </body>
        </html>
      `;
      
      return res.end(errorHtml);
    }
  }
  
  // ===== 404 =====
  console.log(`❌ 404: ${path}`);
  res.status(404).end(`
    <html>
      <body style="font-family: Arial; padding: 40px;">
        <h1>404</h1>
        <p>${path}</p>
        <a href="/">Home</a>
      </body>
    </html>
  `);
};
