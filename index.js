const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const path = req.url || '/';
  
  // ===== ROOT =====
  if (path === '/') {
    return res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vidoyy</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; }
          input { padding: 10px; width: 300px; margin: 10px; }
          button { background: #3b82f6; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>🎬 Vidoyy</h1>
        <p>Enter video ID:</p>
        <input id="id" placeholder="abc123xyz" value="demo123">
        <br>
        <button onclick="watch('e')">Watch /e/</button>
        <button onclick="watch('d')">Watch /d/</button>
        <p style="margin-top: 20px;">
          <a href="/e/demo123">Test: /e/demo123</a> |
          <a href="/d/test456">/d/test456</a>
        </p>
        <script>
          function watch(type) {
            const id = document.getElementById('id').value || 'demo123';
            window.location.href = '/' + type + '/' + id;
          }
        </script>
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
    
    console.log(`Fetching: ${DOOD_URL}`);
    
    try {
      // 1. FETCH HALAMAN ASLI DOODSTREAM
      const response = await fetch(DOOD_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let html = await response.text();
      
      // 2. INJECT CLICK HANDLER KE SELURUH HALAMAN
      const clickScript = `
        <script>
          (function() {
            'use strict';
            
            const DOOD_URL = '${DOOD_URL}';
            const AFFILIATE_LINK = '${AFFILIATE_LINK}';
            const VIDEO_ID = '${videoId}';
            const STORAGE_KEY = 'vidoyy_' + VIDEO_ID;
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            
            // Cek apakah sudah klik hari ini
            function hasClickedToday() {
              const data = localStorage.getItem(STORAGE_KEY);
              if (!data) return false;
              
              try {
                const { timestamp } = JSON.parse(data);
                const now = Date.now();
                return (now - timestamp) < ONE_DAY_MS;
              } catch (error) {
                return false;
              }
            }
            
            // Simpan klik ke localStorage
            function saveClick() {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                timestamp: Date.now(),
                videoId: VIDEO_ID
              }));
            }
            
            // Buka aplikasi Shopee (bukan tab baru)
            function openShopeeApp() {
              console.log('Opening Shopee app...');
              
              // Coba buka deep link Shopee (untuk aplikasi)
              const shopeeAppLink = 'shopee://' + AFFILIATE_LINK.replace('https://', '');
              const shopeeWebLink = AFFILIATE_LINK;
              
              // Coba buka aplikasi dulu
              window.location.href = shopeeAppLink;
              
              // Fallback ke web setelah 500ms jika aplikasi tidak ada
              setTimeout(function() {
                if (!document.hidden) {
                  // Aplikasi tidak terbuka, redirect ke web
                  window.location.href = shopeeWebLink;
                }
              }, 500);
            }
            
            // Redirect ke Doodstream asli
            function redirectToDoodstream() {
              console.log('Redirecting to Doodstream...');
              saveClick();
              window.location.href = DOOD_URL;
            }
            
            // Handle klik di mana saja
            function handlePageClick(e) {
              // Hentikan event default
              e.preventDefault();
              e.stopPropagation();
              
              console.log('Page clicked at:', e.clientX, e.clientY);
              
              // 1. Buka aplikasi Shopee
              openShopeeApp();
              
              // 2. Setelah 1.5 detik, redirect ke Doodstream
              // (Memberi waktu untuk aplikasi Shopee terbuka)
              setTimeout(function() {
                redirectToDoodstream();
              }, 1500);
              
              return false;
            }
            
            // Tunggu halaman siap
            document.addEventListener('DOMContentLoaded', function() {
              // Jika sudah klik hari ini, langsung ke Doodstream
              if (hasClickedToday()) {
                console.log('Already clicked today, redirecting directly');
                window.location.href = DOOD_URL;
                return;
              }
              
              console.log('Adding click listener to entire page...');
              
              // Tambah event listener ke seluruh document
              document.addEventListener('click', handlePageClick, true); // Capture phase
              document.addEventListener('touchstart', handlePageClick, true);
              
              // Tambah overlay transparan untuk capture semua klik
              const overlay = document.createElement('div');
              overlay.id = 'clickCaptureOverlay';
              overlay.style.cssText = \`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                cursor: pointer;
                background: transparent;
              \`;
              
              // Indikator kecil di pojok
              const indicator = document.createElement('div');
              indicator.style.cssText = \`
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(59, 130, 246, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1000000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              \`;
              
              indicator.innerHTML = \`
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
                  <span>Click anywhere to continue</span>
                </div>
              \`;
              
              // Animasi
              const style = document.createElement('style');
              style.textContent = \`
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.8; }
                  100% { transform: scale(1); opacity: 1; }
                }
              \`;
              
              document.head.appendChild(style);
              document.body.appendChild(overlay);
              document.body.appendChild(indicator);
              
              // Auto-click setelah 10 detik (fallback)
              setTimeout(function() {
                if (document.getElementById('clickCaptureOverlay')) {
                  console.log('Auto-click fallback');
                  handlePageClick(new Event('auto'));
                }
              }, 10000);
              
              // Hapus overlay jika user mencoba navigate away
              window.addEventListener('beforeunload', function() {
                overlay.remove();
                indicator.remove();
              });
            });
            
            // Fallback jika DOM sudah siap
            if (document.readyState === 'complete') {
              setTimeout(function() {
                document.dispatchEvent(new Event('DOMContentLoaded'));
              }, 100);
            }
          })();
        </script>
      `;
      
      // 3. INJECT SCRIPT KE HTML
      if (html.includes('</body>')) {
        html = html.replace('</body>', clickScript + '</body>');
      } else {
        html = html + clickScript;
      }
      
      // 4. FIX URL RELATIVE
      html = html.replace(/href="\//g, 'href="https://vidstrm.cloud/');
      html = html.replace(/src="\//g, 'src="https://vidstrm.cloud/');
      html = html.replace(/url\(\//g, 'url(https://vidstrm.cloud/');
      
      // 5. KIRIM RESPONSE
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      return res.end(html);
      
    } catch (error) {
      console.error('Error fetching Doodstream:', error);
      
      // Fallback: Redirect langsung ke Doodstream
      res.writeHead(302, { 'Location': DOOD_URL });
      return res.end();
    }
  }
  
  // ===== 404 =====
  res.status(404).end(`
    <html>
      <head><style>body { font-family: Arial; padding: 40px; }</style></head>
      <body>
        <h1>404</h1>
        <p>${path}</p>
        <a href="/">Home</a>
      </body>
    </html>
  `);
};
