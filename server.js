const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// List affiliate links
const affiliateLinks = [
  'https://doobf.pro/8AQUp3ZesV',
  'https://doobf.pro/9pYio8K2cw',
  'https://doobf.pro/8pgBcJjIzl',
  'https://doobf.pro/60M0F7txlS',
  'https://vidoyy.fun/7VAo1N0hIp',
  'https://vidoyy.fun/9KcSCm0Xb7',
  'https://vidoyy.fun/3LLF3lT65E',
  'https://vidoyy.fun/6VIGpbCEoc'
];

// Middleware untuk cookies
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key && value) req.cookies[key.trim()] = value.trim();
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

// Tangkap semua path
app.get('*', (req, res) => {
  // Ambil FULL path dari URL
  const fullPath = req.path;
  
  // Get or create User ID
  let userId = req.cookies.userId;
  if (!userId) {
    userId = generateUserId();
  }
  
  // Get random affiliate
  const affiliateUrl = getRandomAffiliate();
  
  // ⭐⭐⭐ AUTO PATH SYSTEM ⭐⭐⭐
  // Jika path mengandung /d/123, ambil bagian 123-nya
  let targetPath = '';
  
  if (fullPath.startsWith('/d/')) {
    // Contoh: /d/123 → ambil "123"
    targetPath = fullPath.substring(3); // Hapus "/d/"
  } else if (fullPath !== '/') {
    // Contoh: /123 → ambil "123" juga
    targetPath = fullPath.substring(1); // Hapus "/"
  }
  
  // Build target URL
  let targetUrl;
  if (targetPath) {
    // Jika ada path: → https://vidstrm.cloud/d/[path]
    targetUrl = `https://vidstrm.cloud/d/${targetPath}`;
  } else {
    // Jika root: → https://vidstrm.cloud/
    targetUrl = 'https://vidstrm.cloud/';
  }
  
  console.log(`Path: ${fullPath} → Target: ${targetUrl}`);
  
  // HTML Response
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
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
        background: rgba(255,255,255,0.1);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
      }
      h1 { margin-bottom: 20px; }
      .countdown {
        font-size: 60px;
        font-weight: bold;
        margin: 30px 0;
        color: #4CAF50;
      }
      .user-id {
        background: rgba(0,0,0,0.3);
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        font-family: monospace;
        word-break: break-all;
      }
      .path-info {
        background: rgba(0,0,0,0.2);
        padding: 10px;
        border-radius: 8px;
        margin: 10px 0;
      }
    </style>
  </head>
  <body onclick="redirectUser()">
    <div class="container">
      <h1>⏳ Sedang Mengalihkan...</h1>
      
      <div class="path-info">
        <div>Path: <b>${fullPath}</b></div>
        <div>Target: <b>${targetUrl}</b></div>
      </div>
      
      <p>Anda akan diarahkan dalam:</p>
      <div class="countdown" id="countdown">3</div>
      
      <div class="user-id">
        <div>User ID:</div>
        <div id="userIdDisplay">${userId}</div>
      </div>
      
      <p style="margin-top: 20px;">Klik di mana saja untuk mempercepat</p>
    </div>

    <script>
      const userId = "${userId}";
      const affiliateUrl = "${affiliateUrl}";
      const targetUrl = "${targetUrl}";
      let countdown = 3;
      let redirecting = false;
      
      document.getElementById('userIdDisplay').textContent = userId;
      
      function redirectUser() {
        if (redirecting) return;
        redirecting = true;
        
        const shopeeUrl = affiliateUrl + '?ref=' + userId;
        window.open(shopeeUrl, '_blank');
        
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      }
      
      function startCountdown() {
        const timer = setInterval(() => {
          countdown--;
          document.getElementById('countdown').textContent = countdown;
          
          if (countdown <= 0) {
            clearInterval(timer);
            redirectUser();
          }
        }, 1000);
      }
      
      window.onload = function() {
        startCountdown();
        document.addEventListener('click', redirectUser);
      };
    </script>
  </body>
  </html>
  `;
  
  // Set cookie
  res.setHeader('Set-Cookie', `userId=${userId}; Max-Age=2592000; Path=/; SameSite=Lax`);
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`\n🎯 AUTO PATH SYSTEM:`);
  console.log(`   http://localhost:${PORT}/d/123`);
  console.log(`     → https://vidstrm.cloud/d/123`);
  console.log(`\n   http://localhost:${PORT}/d/abc`);
  console.log(`     → https://vidstrm.cloud/d/abc`);
  console.log(`\n   http://localhost:${PORT}/d/fq3rzpbd5cvj`);
  console.log(`     → https://vidstrm.cloud/d/fq3rzpbd5cvj`);
  console.log(`\n   http://localhost:${PORT}/`);
  console.log(`     → https://vidstrm.cloud/`);
  console.log(`\n   http://localhost:${PORT}/123`);
  console.log(`     → https://vidstrm.cloud/d/123`);
  console.log(`\n🎲 ${affiliateLinks.length} affiliate links (random)`);
});
