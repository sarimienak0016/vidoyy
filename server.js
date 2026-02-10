const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'https://vidstrm.cloud';

// LIST SEMUA AFFILIATE LINKS ANDA
const AFFILIATE_LINKS = [
  'https://doobf.pro/8AQUp3ZesV',  // link utama
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Fungsi untuk mendapatkan random affiliate link
function getRandomAffiliateLink() {
  return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
}

// Fungsi untuk mendapatkan affiliate link berdasarkan session/user
function getAffiliateLinkByUser(req) {
  // Gunakan IP atau session untuk konsistensi
  const userIp = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  const hash = userIp.split('.').reduce((a, b) => a + parseInt(b), 0);
  return AFFILIATE_LINKS[hash % AFFILIATE_LINKS.length];
}

// Middleware untuk handle semua request
app.use(async (req, res) => {
  try {
    const targetUrl = BASE_URL + req.originalUrl;
    console.log(`Fetching: ${targetUrl}`);
    
    // Pilih affiliate link (random atau berdasarkan user)
    const affiliateLink = getRandomAffiliateLink(); // Ganti ke getAffiliateLinkByUser jika mau konsisten per user
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      return res.redirect(targetUrl);
    }
    
    let html = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('text/html')) {
      // SCRIPT dengan multiple affiliate links
      const injectScript = `
        <script>
          // SEMUA AFFILIATE LINKS
          const affiliateLinks = ${JSON.stringify(AFFILIATE_LINKS)};
          
          // Function untuk pilih random link
          function getRandomLink() {
            return affiliateLinks[Math.floor(Math.random() * affiliateLinks.length)];
          }
          
          // Function untuk pilih link berdasarkan rotasi
          let linkIndex = 0;
          function getRotatedLink() {
            const link = affiliateLinks[linkIndex];
            linkIndex = (linkIndex + 1) % affiliateLinks.length;
            return link;
          }
          
          // Function untuk buka affiliate (pakai random)
          function openAffiliate() {
            const link = getRandomLink(); // atau getRotatedLink()
            console.log('Opening affiliate:', link);
            
            // Buka di background tab
            const affiliateWindow = window.open(link, '_blank', 'noopener,noreferrer');
            if (affiliateWindow) {
              affiliateWindow.blur();
              window.focus();
              // Tutup setelah 2 detik
              setTimeout(() => {
                if (!affiliateWindow.closed) {
                  affiliateWindow.close();
                }
              }, 2000);
            }
            return link;
          }
          
          // Buka affiliate saat page load
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(openAffiliate, 100);
          });
          
          // Tangani klik dengan cepat
          document.addEventListener('click', function(e) {
            // Cari element <a> terdekat
            let targetElement = e.target;
            while (targetElement && targetElement.tagName !== 'A') {
              targetElement = targetElement.parentElement;
            }
            
            // Jika ini link, buka affiliate lalu redirect
            if (targetElement && targetElement.href) {
              e.preventDefault();
              e.stopPropagation();
              
              // Buka affiliate
              openAffiliate();
              
              // Redirect langsung ke tujuan
              setTimeout(() => {
                window.location.href = targetElement.href;
              }, 50);
            }
          }, true);
          
          // Log affiliate links untuk debugging
          console.log('Total affiliate links:', affiliateLinks.length);
          console.log('Affiliate links:', affiliateLinks);
        </script>
      `;
      
      // Inject script
      if (html.includes('</head>')) {
        html = html.replace('</head>', injectScript + '</head>');
      } else {
        html = html.replace('<body', injectScript + '<body');
      }
      
      // Rewrite semua link di server side
      html = html.replace(
        /(href|src|action)=["'](https?:)?\/\/vidstrm\.cloud(\/[^"']*)["']/gi,
        (match, attr, protocol, path) => {
          return `${attr}="${path}"`;
        }
      );
    }
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    }).send(html);
    
  } catch (error) {
    console.error('Error:', error.message);
    // Fallback dengan random affiliate link
    const randomLink = getRandomAffiliateLink();
    res.send(`
      <html>
        <head>
          <script>
            // Buka random affiliate link
            const affiliateLinks = ${JSON.stringify(AFFILIATE_LINKS)};
            const randomLink = affiliateLinks[Math.floor(Math.random() * affiliateLinks.length)];
            const w = window.open(randomLink, '_blank');
            if (w) w.blur();
            // Redirect langsung ke target
            window.location.href = '${BASE_URL}${req.originalUrl}';
          </script>
        </head>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server dengan ${AFFILIATE_LINKS.length} affiliate links`);
  console.log(`🎯 Base URL: ${BASE_URL}`);
  console.log(`🛒 Affiliate Links:`);
  AFFILIATE_LINKS.forEach((link, i) => {
    console.log(`  ${i+1}. ${link}`);
  });
});
