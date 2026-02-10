const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Store user IDs
const userStore = new Map();

// Generate user ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Main route
app.get('/', (req, res) => {
  // Get or create user ID
  let userId = req.query.uid || req.cookies?.userId;
  if (!userId) {
    userId = generateUserId();
  }
  
  // Store user ID
  userStore.set(userId, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    visitTime: new Date().toISOString()
  });
  
  // HTML with click tracking
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Loading...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      }
      .container {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
      }
      h1 { margin-bottom: 20px; font-size: 24px; }
      .countdown {
        font-size: 48px;
        font-weight: bold;
        margin: 20px 0;
        color: #4CAF50;
      }
      .user-id {
        background: rgba(0,0,0,0.2);
        padding: 10px;
        border-radius: 8px;
        margin: 20px 0;
        font-family: monospace;
        word-break: break-all;
      }
      .info {
        font-size: 14px;
        opacity: 0.8;
        margin-top: 20px;
      }
    </style>
    <script>
      // Get user ID
      function getUserId() {
        // From URL
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('uid');
        
        // From cookie
        if (!userId) {
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});
          userId = cookies.userId;
        }
        
        // Generate new
        if (!userId) {
          userId = 'user_' + Math.random().toString(36).substr(2, 9);
          document.cookie = 'userId=' + userId + '; max-age=2592000; path=/';
        }
        
        return userId;
      }
      
      // Redirect function
      function performRedirect() {
        const userId = getUserId();
        const shopeeUrl = 'https://doobf.pro/8AQUp3ZesV?ref=' + userId;
        const targetUrl = 'https://vidstrm.cloud/d/fq3rzpbd5cvj';
        
        // Open Shopee in new tab
        window.open(shopeeUrl, '_blank');
        
        // Redirect current page after delay
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);
      }
      
      // Start countdown
      let count = 5;
      function startCountdown() {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
          const timer = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            
            if (count <= 0) {
              clearInterval(timer);
              performRedirect();
            }
          }, 1000);
        }
      }
      
      // Setup click listener
      document.addEventListener('DOMContentLoaded', function() {
        startCountdown();
        
        // Click anywhere to redirect
        document.body.addEventListener('click', function(e) {
          e.preventDefault();
          performRedirect();
          return false;
        });
        
        // Display user ID
        const userId = getUserId();
        document.getElementById('userId').textContent = userId;
      });
    </script>
  </head>
  <body>
    <div class="container">
      <h1>🔗 Sedang Mengalihkan...</h1>
      <p>Anda akan diarahkan dalam:</p>
      <div class="countdown" id="countdown">5</div>
      
      <div class="user-id">
        <div>ID Anda:</div>
        <div id="userId">Loading...</div>
      </div>
      
      <p style="margin-top: 20px;">Klik di mana saja untuk mempercepat</p>
      
      <div class="info">
        <p>Redirect melalui affiliate link untuk mendukung kami</p>
        <p>Terima kasih 🙏</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  // Set cookie
  res.setHeader('Set-Cookie', `userId=${userId}; Max-Age=2592000; Path=/; SameSite=Lax`);
  
  res.send(html);
});

// API endpoint untuk tracking
app.get('/api/track', (req, res) => {
  const { userId, action } = req.query;
  
  if (userId && userStore.has(userId)) {
    const userData = userStore.get(userId);
    userData.lastAction = action || 'click';
    userData.lastActionTime = new Date().toISOString();
    
    console.log('User action:', userId, action);
  }
  
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});
