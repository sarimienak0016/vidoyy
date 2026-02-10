const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// SEMUA AFFILIATE LINKS
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

// Middleware untuk handle semua request
app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.originalUrl;
    console.log(`Fetching: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    
    if (!response.ok) {
      return res.redirect(targetUrl);
    }
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('text/html')) {
      // SCRIPT dengan AUTO-REDIRECT ke Shopee setelah timeout
      const injectScript = `
        <script>
          // Config
          const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
          const TARGET_URL = '${targetUrl}';
          const IDLE_TIMEOUT = 5000; // 5 detik jika tidak klik
          const CLICK_TIMEOUT = 1000; // 1 detik setelah klik
          
          let hasClicked = false;
          let affiliateWindow = null;
          let idleTimer = null;
          let redirectTimer = null;
          
          // Function untuk pilih random affiliate
          function getRandomAffiliate() {
            return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
          }
          
          // Function untuk buka affiliate di TAB SAMA (bukan new tab)
          function openAffiliateInSameTab() {
            if (hasClicked) return;
            const affiliateUrl = getRandomAffiliate();
            console.log('Auto-redirect to affiliate:', affiliateUrl);
            
            // Redirect ke affiliate di TAB YANG SAMA
            window.location.href = affiliateUrl;
            return affiliateUrl;
          }
          
          // Function untuk buka affiliate di NEW TAB
          function openAffiliateInNewTab() {
            const affiliateUrl = getRandomAffiliate();
            affiliateWindow = window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
            if (affiliateWindow) {
              affiliateWindow.blur();
              window.focus();
            }
            return affiliateUrl;
          }
          
          // Function untuk reset idle timer
          function resetIdleTimer() {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
              if (!hasClicked) {
                console.log('User idle, redirecting to affiliate...');
                openAffiliateInSameTab();
              }
            }, IDLE_TIMEOUT);
          }
          
          // === STRATEGI 1: AUTO-REDIRECT SETELAH 5 DETIK IDLE ===
          // Mulai idle timer
          resetIdleTimer();
          
          // Reset timer pada user activity
          ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
              if (!hasClicked) {
                resetIdleTimer();
              }
            }, { passive: true });
          });
          
          // === STRATEGI 2: TANGANI KLIK USER ===
          document.addEventListener('click', function(e) {
            // Cari element <a> terdekat
            let targetElement = e.target;
            while (targetElement && targetElement.tagName !== 'A') {
              targetElement = targetElement.parentElement;
            }
            
            // Jika user klik link
            if (targetElement && targetElement.href) {
              e.preventDefault();
              e.stopPropagation();
              
              hasClicked = true;
              clearTimeout(idleTimer);
              
              // 1. Buka affiliate di NEW TAB
              openAffiliateInNewTab();
              
              // 2. Redirect ke target asli setelah delay singkat
              clearTimeout(redirectTimer);
              redirectTimer = setTimeout(() => {
                window.location.href = targetElement.href;
              }, CLICK_TIMEOUT);
              
              return;
            }
            
            // Jika klik di area lain (bukan link)
            if (!hasClicked) {
              hasClicked = true;
              clearTimeout(idleTimer);
              
              // Buka affiliate di TAB SAME
              setTimeout(() => {
                openAffiliateInSameTab();
              }, 500);
            }
          }, true);
          
          // === STRATEGI 3: TAMPILKAN COUNTDOWN UNTUK AUTO-REDIRECT ===
          document.addEventListener('DOMContentLoaded', function() {
            // Tambahkan countdown di pojok
            const countdownEl = document.createElement('div');
            countdownEl.id = 'affiliate-countdown';
            countdownEl.style.cssText = \`
              position: fixed;
              bottom: 20px;
              right: 20px;
              background: #ff3b30;
              color: white;
              padding: 10px 15px;
              border-radius: 20px;
              font-family: Arial;
              font-size: 14px;
              z-index: 99999;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            \`;
            
            let countdown = Math.floor(IDLE_TIMEOUT / 1000);
            countdownEl.innerHTML = \`Akan ke Shopee dalam: <b>\${countdown}</b> detik\`;
            document.body.appendChild(countdownEl);
            
            // Update countdown
            const countdownInterval = setInterval(() => {
              if (hasClicked) {
                clearInterval(countdownInterval);
                countdownEl.style.display = 'none';
                return;
              }
              
              countdown--;
              if (countdown > 0) {
                countdownEl.innerHTML = \`Akan ke Shopee dalam: <b>\${countdown}</b> detik\`;
              } else {
                countdownEl.innerHTML = \`Mengalihkan ke Shopee...\`;
                clearInterval(countdownInterval);
              }
            }, 1000);
            
            // Button untuk skip
            const skipBtn = document.createElement('button');
            skipBtn.innerHTML = 'Skip';
            skipBtn.style.cssText = \`
              margin-left: 10px;
              background: white;
              color: #ff3b30;
              border: none;
              padding: 4px 12px;
              border-radius: 10px;
              cursor: pointer;
              font-weight: bold;
            \`;
            skipBtn.onclick = function() {
              hasClicked = true;
              clearTimeout(idleTimer);
              clearInterval(countdownInterval);
              countdownEl.style.display = 'none';
            };
            countdownEl.appendChild(skipBtn);
          });
          
          console.log('Auto-redirect system aktif!');
          console.log(\`Akan redirect ke Shopee setelah \${IDLE_TIMEOUT/1000} detik idle\`);
        </script>
        
        <style>
          #affiliate-countdown {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      `;
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else {
        html = html.replace('<body', injectScript + '<body');
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
  console.log(`🚀 Server dengan auto-redirect ke ${AFFILIATE_LINKS.length} affiliate links`);
  console.log(`⏱️  Auto-redirect setelah 5 detik idle`);
});
