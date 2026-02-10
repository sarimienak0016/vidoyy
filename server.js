const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// LIST AFFILIATE LINKS (semua link affiliate Anda)
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
  // Simple cookie parser
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts[0] && parts[1]) {
        req.cookies[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  next();
});

// Generate User ID
function generateUserId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `UID${timestamp}_${random}`;
}

// Get RANDOM affiliate dari list
function getRandomAffiliate() {
  const randomIndex = Math.floor(Math.random() * affiliateLinks.length);
  return affiliateLinks[randomIndex];
}

// Main Route - TANGKAP SEMUA PATH
app.get('*', (req, res) => {
  // Ambil path dari URL
  const fullPath = req.path;
  const path = fullPath === '/' ? '' : fullPath.substring(1);
  
  // Get or create User ID
  let userId = req.cookies.userId;
  let isNewUser = false;
  
  if (!userId) {
    userId = generateUserId();
    isNewUser = true;
    console.log('🆕 NEW USER:', userId, 'Path:', path || '(root)');
  } else {
    console.log('👤 RETURNING USER:', userId, 'Path:', path || '(root)');
  }
  
  // Get RANDOM affiliate link
  const affiliateUrl = getRandomAffiliate();
  
  // TARGET URL berdasarkan path
  let targetUrl = 'https://vidstrm.cloud/d/fq3rzpbd5cvj'; // default
  if (path && path !== '') {
    targetUrl = `https://vidstrm.cloud/d/${path}`;
  }
  
  // HTML Response
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirecting${path ? `: ${path}` : ''}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        padding: 20px;
        cursor: pointer;
      }
      
      .container {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        padding: 40px 30px;
        border-radius: 25px;
        max-width: 550px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      }
      
      .header {
        margin-bottom: 25px;
      }
      
      .header h1 {
        font-size: 28px;
        margin-bottom: 10px;
        background: linear-gradient(45deg, #00d4ff, #0088ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .status-badge {
        display: inline-block;
        padding: 8px 20px;
        background: ${isNewUser ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.3)'};
        border: 1px solid ${isNewUser ? 'rgba(76, 175, 80, 0.5)' : 'rgba(33, 150, 243, 0.5)'};
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      
      .path-display {
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .path-label {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 8px;
        color: #00d4ff;
      }
      
      .path-value {
        font-size: 22px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        color: #ffffff;
      }
      
      .id-display {
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .id-label {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 8px;
        color: #00ff88;
      }
      
      .id-value {
        font-size: 18px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        color: #00ffcc;
        word-break: break-all;
      }
      
      .countdown-box {
        background: rgba(255, 71, 87, 0.1);
        border: 1px solid rgba(255, 71, 87, 0.3);
        border-radius: 15px;
        padding: 25px;
        margin: 25px 0;
      }
      
      .countdown-number {
        font-size: 72px;
        font-weight: bold;
        color: #ff4757;
        text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
        margin: 10px 0;
      }
      
      .click-instruction {
        background: rgba(255, 215, 0, 0.1);
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        font-size: 18px;
        font-weight: bold;
        animation: pulse 2s infinite;
      }
      
      .info-box {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 15px;
        margin: 15px 0;
        font-size: 14px;
        text-align: left;
      }
      
      .footer {
        margin-top: 25px;
        font-size: 12px;
        opacity: 0.6;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎲 RANDOM AFFILIATE REDIRECT</h1>
        <div class="status-badge">
          ${isNewUser ? '🆕 NEW USER - AUTO ID GENERATED' : '👤 RETURNING USER'}
        </div>
      </div>
      
      ${path ? `
      <div class="path-display">
        <div class="path-label">🌐 DYNAMIC PATH DETECTED:</div>
        <div class="path-value">/${path}</div>
      </div>
      ` : `
      <div class="path-display">
        <div class="path-label">🌐 PATH:</div>
        <div class="path-value">/ (Root - Default Target)</div>
      </div>
      `}
      
      <div class="id-display">
        <div class="id-label">🎯 YOUR AUTO ID:</div>
        <div class="id-value" id="userIdDisplay">${userId}</div>
      </div>
      
      <div class="countdown-box">
        <div>Redirect in:</div>
        <div class="countdown-number" id="countdown">2</div>
        <div>seconds</div>
      </div>
      
      <div class="click-instruction">
        ⚡ CLICK ANYWHERE TO REDIRECT NOW ⚡
      </div>
      
      <div class="info-box">
        <div style="margin-bottom: 10px; color: #00d4ff;">📊 SYSTEM INFO:</div>
        <div><span style="color: #ffd700;">• Affiliate:</span> ${affiliateUrl.substring(0, 35)}...</div>
        <div><span style="color: #ffd700;">• Target:</span> ${targetUrl}</div>
        <div><span style="color: #ffd700;">• Affiliate Pool:</span> ${affiliateLinks.length} links ready</div>
      </div>
      
      <div class="footer">
        <p>✨ Auto Path + Random Affiliate System ✨</p>
        <p>Every click opens a RANDOM affiliate from ${affiliateLinks.length} links</p>
      </div>
    </div>

    <script>
      // Data dari server
      const USER_ID = "${userId}";
      const AFFILIATE_URL = "${affiliateUrl}";
      const TARGET_URL = "${targetUrl}";
      const PATH = "${path}";
      
      let countdown = 2;
      let isRedirecting = false;
      
      console.log('🚀 RANDOM AFFILIATE SYSTEM LOADED');
      console.log('User ID:', USER_ID);
      console.log('Path:', PATH || '(root)');
      console.log('Random Affiliate:', AFFILIATE_URL);
      console.log('Target:', TARGET_URL);
      
      // Display user ID
      document.getElementById('userIdDisplay').textContent = USER_ID;
      
      // Redirect function
      function performRedirect() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        console.log('🔄 Starting redirect process...');
        
        // Build affiliate URL dengan parameters
        const affiliateWithParams = AFFILIATE_URL + 
          '?ref=' + encodeURIComponent(USER_ID) +
          '&path=' + encodeURIComponent(PATH) +
          '&utm_source=redirect_system' +
          '&utm_medium=auto_id' +
          '&utm_campaign=' + encodeURIComponent(PATH || 'root');
        
        console.log('🛍️ Opening affiliate:', affiliateWithParams);
        
        // Open affiliate in NEW TAB
        const affiliateWindow = window.open(affiliateWithParams, '_blank');
        
        // Redirect current page setelah delay singkat
        setTimeout(() => {
          console.log('🎯 Redirecting to target:', TARGET_URL);
          window.location.href = TARGET_URL;
        }, 150);
        
        return false;
      }
      
      // Countdown timer
      function startCountdown() {
        const countdownEl = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          countdown--;
          countdownEl.textContent = countdown;
          
          if (countdown <= 0) {
            clearInterval(timer);
            console.log('⏰ Countdown finished, auto redirecting...');
            performRedirect();
          }
        }, 1000);
      }
      
      // Setup event listeners
      function setupEventListeners() {
        // Click anywhere on body
        document.body.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🖱️ Body click detected');
          performRedirect();
          return false;
        }, true);
        
        // Additional click listener for document
        document.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          performRedirect();
          return false;
        }, true);
        
        // Touch events for mobile
        document.body.addEventListener('touchstart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('📱 Touch detected');
          performRedirect();
          return false;
        }, true);
      }
      
      // Initialize
      window.onload = function() {
        console.log('✅ Page fully loaded');
        
        // Start countdown
        startCountdown();
        
        // Setup event listeners
        setupEventListeners();
        
        // Send tracking data (optional)
        fetch('/api/track?userId=' + USER_ID + '&path=' + PATH + '&affiliate=' + encodeURIComponent(AFFILIATE_URL))
          .then(() => console.log('📊 Tracking data sent'))
          .catch(() => console.log('📊 Tracking skipped'));
      };
      
      // Backup auto redirect setelah 4 detik
      setTimeout(() => {
        if (!isRedirecting) {
          console.log('⚠️ Backup auto redirect triggered');
          performRedirect();
        }
      }, 4000);
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
  const { userId, path, affiliate } = req.query;
  console.log(`📈 TRACKING: User ${userId} | Path: ${path || 'root'} | Affiliate: ${affiliate ? affiliate.substring(0, 30) + '...' : 'unknown'}`);
  res.json({ 
    status: 'tracked', 
    userId, 
    path: path || 'root',
    affiliate: affiliate ? 'hidden_for_privacy' : null,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
  console.log(`\n🎯 DYNAMIC PATH TESTING:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/123`);
  console.log(`   http://localhost:${PORT}/abc`);
  console.log(`   http://localhost:${PORT}/test-product`);
  console.log(`   http://localhost:${PORT}/any-custom-path`);
  console.log(`\n🔄 RANDOM AFFILIATE SYSTEM:`);
  console.log(`   Total affiliate links: ${affiliateLinks.length}`);
  affiliateLinks.forEach((link, index) => {
    console.log(`   ${index + 1}. ${link}`);
  });
  console.log(`\n🎯 TARGET MAPPING:`);
  console.log(`   / → https://vidstrm.cloud/d/fq3rzpbd5cvj`);
  console.log(`   /[path] → https://vidstrm.cloud/d/[path]`);
});
