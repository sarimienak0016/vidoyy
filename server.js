const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// TAMBAHAN LINK AFFILIATE (semua link affiliate Anda)
const affiliateLinks = [
  'https://doobf.pro/8AQUp3ZesV',  // link utama
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl', 
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Middleware untuk parse cookies
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      req.cookies[parts[0]?.trim()] = parts[1]?.trim();
    });
  }
  next();
});

// Generate User ID
function generateUserId() {
  return 'uid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Get random affiliate
function getRandomAffiliate() {
  const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
  return affiliateLinks[randomIndex];
}

// Tangkap SEMUA path
app.get('*', (req, res) => {
  // Ambil path dari URL
  const path = req.path === '/' ? '' : req.path.substring(1);
  
  // Get or create User ID
  let userId = req.cookies.userId;
  
  if (!userId) {
    userId = generateUserId();
    console.log('New User ID:', userId, 'Path:', path || '(root)');
  }
  
  // Get random affiliate
  const affiliateUrl = getRandomAffiliate();
  
  // AUTO PATH: Target URL berdasarkan path
  let targetUrl = 'https://vidstrm.cloud/d/fq3rzpbd5cvj';
  if (path && path !== '') {
    targetUrl = `https://vidstrm.cloud/d/${path}`;
  }
  
  // HTML Response (sama seperti sebelumnya)
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirecting...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        cursor: pointer;
      }
      
      .container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      
      h1 {
        font-size: 28px;
        margin-bottom: 20px;
        color: white;
      }
      
      .countdown {
        font-size: 60px;
        font-weight: bold;
        margin: 30px 0;
        color: #4CAF50;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      
      .user-id-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        font-family: monospace;
        word-break: break-all;
        font-size: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .user-id-label {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 5px;
      }
      
      .instructions {
        margin-top: 25px;
        font-size: 16px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      
      .footer {
        margin-top: 20px;
        font-size: 12px;
        opacity: 0.7;
      }
    </style>
  </head>
  <body onclick="redirectUser()">
    <div class="container">
      <h1>⏳ Sedang Mengalihkan...</h1>
      
      ${path ? `<p>Path: <b>/${path}</b></p>` : ''}
      
      <p>Anda akan diarahkan dalam:</p>
      
      <div class="countdown" id="countdown">5</div>
      
      <div class="user-id-box">
        <div class="user-id-label">USER ID ANDA:</div>
        <div id="userIdDisplay">${userId}</div>
      </div>
      
      <div class="instructions">
        <p>🖱️ <b>KLIK DI MANA SAJA</b> untuk mempercepat redirect</p>
        <p>atau tunggu hitungan mundur selesai</p>
      </div>
      
      <div class="footer">
        <p>Redirect melalui affiliate link untuk mendukung kami</p>
        <p>Terima kasih atas pengertiannya 🙏</p>
      </div>
    </div>

    <script>
      // Variables
      const userId = "${userId}";
      const affiliateUrl = "${affiliateUrl}";
      const targetUrl = "${targetUrl}";
      let countdown = 5;
      let redirecting = false;
      
      // Display user ID
      document.getElementById('userIdDisplay').textContent = userId;
      
      // Redirect function
      function redirectUser() {
        if (redirecting) return;
        redirecting = true;
        
        console.log('Redirecting user:', userId);
        
        // Shopee affiliate URL dengan user ID
        const shopeeUrl = affiliateUrl + '?ref=' + userId + '&source=redirect_system';
        
        // Open Shopee in new tab
        window.open(shopeeUrl, '_blank');
        
        // Redirect current page after short delay
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      }
      
      // Countdown function
      function startCountdown() {
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          countdown--;
          countdownElement.textContent = countdown;
          
          if (countdown <= 0) {
            clearInterval(timer);
            redirectUser();
          }
        }, 1000);
      }
      
      // Start countdown on page load
      window.onload = function() {
        startCountdown();
        
        // Send tracking data
        fetch('/api/track?action=page_view&userId=' + userId)
          .catch(err => console.log('Tracking OK'));
      };
      
      // Also redirect on any click (as backup)
      document.addEventListener('click', function(e) {
        redirectUser();
        e.preventDefault();
      });
    </script>
  </body>
  </html>
  `;
  
  // Set cookie untuk 30 hari
  res.setHeader('Set-Cookie', `userId=${userId}; Max-Age=${60*60*24*30}; Path=/; SameSite=Lax; HttpOnly`);
  
  res.send(html);
});

// Tracking endpoint
app.get('/api/track', (req, res) => {
  const { userId, action } = req.query;
  console.log(`📊 Tracking: User ${userId} - Action: ${action || 'unknown'}`);
  res.json({ status: 'tracked', userId, action });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
  console.log(`\n🔗 ${affiliateLinks.length} Affiliate Links Ready:`);
  affiliateLinks.forEach((link, i) => {
    console.log(`   ${i+1}. ${link}`);
  });
  console.log(`\n🎯 Auto Path Mapping:`);
  console.log(`   /         → https://vidstrm.cloud/d/fq3rzpbd5cvj`);
  console.log(`   /[path]   → https://vidstrm.cloud/d/[path]`);
  console.log(`\n📝 Contoh: http://localhost:${PORT}/123 → https://vidstrm.cloud/d/123`);
});
