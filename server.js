const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Use cookie parser
app.use(cookieParser());

// Store untuk tracking (in-memory)
const userStore = new Map();

// Generate AUTO ID
function generateAutoId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `AUTO_${timestamp}_${random}`;
}

// Main route
app.get('/', (req, res) => {
  // CEK COOKIE untuk ID
  let userId = req.cookies.userId;
  let isNewUser = false;
  
  // Jika tidak ada ID, BUAT BARU
  if (!userId) {
    userId = generateAutoId();
    isNewUser = true;
    
    // Set cookie
    res.cookie('userId', userId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    });
    
    // Store user info
    userStore.set(userId, {
      firstVisit: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    console.log('🆕 NEW USER:', userId);
  } else {
    console.log('👤 EXISTING USER:', userId);
  }
  
  // HTML dengan AUTO ID yang JELAS
  const html = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirect System - AUTO ID</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
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
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(15px);
        border-radius: 25px;
        padding: 50px 40px;
        max-width: 600px;
        width: 100%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .header {
        margin-bottom: 30px;
      }
      
      .header h1 {
        font-size: 32px;
        margin-bottom: 15px;
        background: linear-gradient(45deg, #ffd700, #ff6b6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .status-badge {
        display: inline-block;
        padding: 8px 20px;
        background: ${isNewUser ? '#4CAF50' : '#2196F3'};
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .countdown-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 30px;
        border-radius: 15px;
        margin: 25px 0;
      }
      
      .countdown-number {
        font-size: 80px;
        font-weight: bold;
        color: #4CAF50;
        text-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
        margin: 15px 0;
      }
      
      .user-id-section {
        background: rgba(0, 0, 0, 0.4);
        padding: 25px;
        border-radius: 15px;
        margin: 25px 0;
        border-left: 5px solid #FF5722;
      }
      
      .user-id-label {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 10px;
        color: #FFD700;
      }
      
      .user-id-value {
        font-family: 'Courier New', monospace;
        font-size: 20px;
        font-weight: bold;
        word-break: break-all;
        color: #00FFCC;
      }
      
      .instructions {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
        font-size: 18px;
        border: 2px dashed rgba(255, 255, 255, 0.3);
      }
      
      .click-anywhere {
        animation: pulse 2s infinite;
        font-size: 20px;
        font-weight: bold;
        color: #FFD700;
        margin-top: 20px;
      }
      
      .footer {
        margin-top: 30px;
        font-size: 14px;
        opacity: 0.8;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔗 AUTO ID REDIRECT SYSTEM</h1>
        <div class="status-badge">
          ${isNewUser ? '🆕 USER BARU' : '👤 USER TERDAFTAR'}
        </div>
        <p>System otomatis akan mengalihkan Anda...</p>
      </div>
      
      <div class="countdown-box">
        <p>Redirect dalam:</p>
        <div class="countdown-number" id="countdown">5</div>
        <p>detik</p>
      </div>
      
      <div class="user-id-section">
        <div class="user-id-label">🎯 AUTO ID ANDA:</div>
        <div class="user-id-value" id="userIdDisplay">${userId}</div>
        <div style="margin-top: 15px; font-size: 14px; opacity: 0.9;">
          ID ini akan dikirim ke affiliate link
        </div>
      </div>
      
      <div class="instructions">
        <p>📍 <b>KLIK DI MANA SAJA PADA HALAMAN INI</b></p>
        <p>untuk langsung diarahkan melalui affiliate link</p>
      </div>
      
      <div class="click-anywhere">
        ⬇️ KLIK DI SINI ATAU DI MANA SAJA ⬇️
      </div>
      
      <div class="footer">
        <p>✨ System by Redirect App ✨</p>
        <p>Auto ID: ${userId.substring(0, 15)}...</p>
      </div>
    </div>
    
    <script>
      // VARIABLES
      const USER_ID = "${userId}";
      let countdown = 5;
      let isRedirecting = false;
      
      console.log('✅ AUTO ID LOADED:', USER_ID);
      
      // Function untuk redirect
      function performRedirect() {
        if (isRedirecting) return;
        isRedirecting = true;
        
        console.log('🔄 Starting redirect for:', USER_ID);
        
        // 1. Shopee affiliate URL dengan AUTO ID
        const shopeeUrl = 'https://doobf.pro/8AQUp3ZesV?ref=' + encodeURIComponent(USER_ID) + 
                         '&utm_source=redirect_app&utm_medium=auto_id';
        
        // 2. Target URL akhir
        const targetUrl = 'https://vidstrm.cloud/d/fq3rzpbd5cvj';
        
        console.log('🛒 Opening Shopee:', shopeeUrl);
        
        // Buka Shopee di TAB BARU
        const shopeeWindow = window.open(shopeeUrl, '_blank');
        
        // Tunggu sebentar, lalu redirect halaman ini
        setTimeout(() => {
          console.log('🎯 Redirecting to target:', targetUrl);
          window.location.href = targetUrl;
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
      function setupListeners() {
        // Klik di mana saja pada body
        document.body.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('🖱️ Click detected, redirecting...');
          performRedirect();
          return false;
        });
        
        // Juga bisa klik pada elemen spesifik
        document.addEventListener('click', function(e) {
          e.preventDefault();
          performRedirect();
          return false;
        }, true);
        
        // Touch events untuk mobile
        document.body.addEventListener('touchstart', function(e) {
          e.preventDefault();
          performRedirect();
          return false;
        });
      }
      
      // Initialize
      window.onload = function() {
        console.log('🚀 Page loaded, AUTO ID:', USER_ID);
        
        // Tampilkan ID
        document.getElementById('userIdDisplay').textContent = USER_ID;
        
        // Start countdown
        startCountdown();
        
        // Setup click listeners
        setupListeners();
        
        // Send tracking data
        fetch('/api/track?action=pageview&userId=' + USER_ID)
          .then(() => console.log('📊 Tracking sent'))
          .catch(() => console.log('📊 Tracking failed'));
      };
      
      // Backup: Auto redirect setelah 8 detik
      setTimeout(() => {
        if (!isRedirecting) {
          console.log('⚠️ Backup auto redirect triggered');
          performRedirect();
        }
      }, 8000);
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

// API untuk tracking
app.get('/api/track', (req, res) => {
  const { userId, action } = req.query;
  console.log(`📈 TRACKING: ${userId
