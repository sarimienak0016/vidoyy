const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_URL = 'https://vidstrm.cloud/d/';
const SHOPEE_AFFILIATE = 'https://doobf.pro/8AQUp3ZesV';

// Middleware untuk clone semua request
app.use(async (req, res) => {
  try {
    // Fetch halaman dari target URL
    const response = await fetch(TARGET_URL + req.url);
    const html = await response.text();
    
    // Inject script untuk intercept semua klik
    const modifiedHtml = html.replace(
      '</head>',
      `<script>
        // Function untuk buka Shopee affiliate
        function openShopeeAffiliate() {
          window.open('${SHOPEE_AFFILIATE}', '_blank');
        }
        
        // Intercept semua klik
        document.addEventListener('click', function(e) {
          // Buka Shopee affiliate
          openShopeeAffiliate();
          
          // Tunggu sebentar, lalu lanjutkan ke link asli
          setTimeout(() => {
            // Jika yang diklik adalah link
            if (e.target.tagName === 'A' && e.target.href) {
              window.location.href = e.target.href;
            }
            // Jika bukan link, redirect ke homepage target
            else {
              window.location.href = '${TARGET_URL}';
            }
          }, 300);
        }, true);
        
        // Intercept form submission
        document.addEventListener('submit', function(e) {
          e.preventDefault();
          openShopeeAffiliate();
          setTimeout(() => {
            e.target.submit();
          }, 300);
        }, true);
        
        // Untuk mobile touch events
        document.addEventListener('touchstart', function(e) {
          openShopeeAffiliate();
          setTimeout(() => {
            if (e.target.tagName === 'A' && e.target.href) {
              window.location.href = e.target.href;
            }
          }, 300);
        }, true);
        
        console.log('Redirect system aktif - Klik dimana saja akan membuka Shopee affiliate terlebih dahulu');
      </script>
      </head>`
    );
    
    // Set header yang sama dengan aslinya
    res.set({
      'Content-Type': response.headers.get('content-type') || 'text/html',
      'Cache-Control': 'no-cache'
    });
    
    res.send(modifiedHtml);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error loading page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Shopee Affiliate: ${SHOPEE_AFFILIATE}`);
});
