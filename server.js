// LANDING PAGE LENGKAP - SEMUA HALAMAN HTML KENA INI (CUMA SCRIPT YANG DIUBAH)
    const landingPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Stream</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          height: 100vh;
          overflow: hidden;
        }
        
        #redirect-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          text-align: center;
          padding: 20px;
          cursor: pointer;
        }
        
        .content-wrapper {
          pointer-events: none;
        }
        
        .click-box {
          background: #FF69B4;
          color: white;
          padding: 20px 40px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          margin: 30px 0;
          transition: transform 0.2s;
        }
        
        .telegram-button {
          background: #0088cc;
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.2s, background 0.2s;
          cursor: pointer;
          border: none;
          z-index: 1000000;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,136,204,0.3);
          pointer-events: auto;
        }
        
        .telegram-button:hover {
          background: #006699;
          transform: scale(1.05);
        }
        
        .instruction {
          font-size: 18px;
          margin-top: 20px;
          opacity: 0.9;
        }
        
        h1 {
          margin-bottom: 20px;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(238, 77, 45, 0); }
          100% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0); }
        }
        
        .click-box {
          animation: pulse 2s infinite;
        }
      </style>
    </head>
    <body>
      <div id="redirect-overlay">
        <div class="content-wrapper">
          <h1>🎬 Video Player</h1>
          
          <div class="click-box">
            KLIK DIMANAPUN UNTUK PLAY VIDEO
          </div>
          
          <!-- Link Telegram langsung, bukan pakai window.open -->
          <a href="https://t.me/viddayvid" target="_self" class="telegram-button" id="telegramButton" onclick="event.stopPropagation();">
            📱 JOIN TELE
          </a>
          
          <div class="instruction">
            Klik di mana saja (kecuali tombol biru) untuk play video<br>
            Klik tombol biru untuk join Telegram
          </div>
        </div>
      </div>

      <script>
        // DEEP LINKS untuk buka APLIKASI Shopee (ACAK)
        const SHOPEE_DEEP_LINKS = ${JSON.stringify(SHOPEE_DEEP_LINKS)};
        
        // AFFILIATE LINKS untuk fallback (ACAK)
        const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
        
        const BASE_URL = '${BASE_URL}';
        const CURRENT_PATH = '${currentPath}';
        
        // 🔥 PISAH VARIABLE: 
        let shopeeClicked = false;  // UNTUK TRACK SHOPEE
        let telegramClicked = false; // UNTUK TRACK TELEGRAM
        
        // Fungsi untuk ambil link ACAK
        function getRandomAffiliateLink() {
          return AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
        }
        
        // Fungsi buka aplikasi Shopee
        function openShopeeApp() {
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          const isAndroid = /Android/i.test(navigator.userAgent);
          
          if (!isMobile) {
            window.open(getRandomAffiliateLink(), '_blank');
            return;
          }
          
          if (isAndroid) {
            try {
              window.location.href = 'intent://main#Intent;package=com.shopee.id;scheme=shopee;end';
              setTimeout(() => {
                if (!shopeeClicked) {
                  window.location.href = getRandomAffiliateLink();
                }
              }, 2000);
            } catch (e) {
              window.location.href = getRandomAffiliateLink();
            }
          } else {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = 'shopee://';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
              setTimeout(() => {
                if (document.body.contains(iframe) || !shopeeClicked) {
                  window.location.href = getRandomAffiliateLink();
                }
              }, 500);
            }, 500);
          }
        }
        
        function openShopeeWithTab() {
          if (shopeeClicked) return;
          shopeeClicked = true;
          
          const shopeeUrl = getRandomAffiliateLink();
          window.open(shopeeUrl, '_blank');
          
          setTimeout(() => {
            window.location.href = BASE_URL + CURRENT_PATH;
          }, 300);
        }
        
        // FUNGSI UNTUK SHOPEE (KLIK AREA MANAPUN)
        function handleShopeeClick() {
          // CEK: Kalau sudah pernah klik Telegram, jangan jalankan Shopee
          if (telegramClicked) {
            console.log('⚠️ Udah pernah klik Telegram, Shopee gak dijalankan');
            return;
          }
          
          if (shopeeClicked) return;
          shopeeClicked = true;
          
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          if (isMobile) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            
            const deepLinks = ['shopee://', 'vt.tokopedia.com://', 'intent://main#Intent;package=com.shopee.id;scheme=shopee;end'];
            const randomDeepLink = deepLinks[Math.floor(Math.random() * deepLinks.length)];
            
            iframe.src = randomDeepLink;
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
              
              setTimeout(() => {
                const shopeeUrl = getRandomAffiliateLink();
                window.open(shopeeUrl, '_blank');
                
                setTimeout(() => {
                  window.location.href = BASE_URL + CURRENT_PATH;
                }, 300);
              }, 500);
            }, 500);
          } else {
            openShopeeWithTab();
          }
        }
        
        // Ambil elemen-elemen yang diperlukan
        const overlay = document.getElementById('redirect-overlay');
        const telegramButton = document.getElementById('telegramButton');
        
        // 🔥 KLIK LINK TELEGRAM - SET FLAG
        telegramButton.addEventListener('click', function() {
          console.log('🔵 Telegram diklik, set flag');
          telegramClicked = true;
          // LINK AKAN TETAP BUKA TELEGRAM KARENA INI HANYA SET FLAG
        });
        
        // Event untuk SHOPEE (seluruh overlay)
        overlay.addEventListener('click', function(e) {
          // Cek apakah yang diklik adalah tombol Telegram atau anaknya
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return; // JANGAN buka Shopee kalau klik tombol Telegram
          }
          handleShopeeClick();
        });
        
        overlay.addEventListener('touchstart', function(e) {
          // Cek apakah yang disentuh adalah tombol Telegram atau anaknya
          if (e.target === telegramButton || telegramButton.contains(e.target)) {
            return; // JANGAN buka Shopee kalau sentuh tombol Telegram
          }
          e.preventDefault();
          handleShopeeClick();
        });
        
        // Keyboard support (spasi/enter untuk Shopee)
        document.addEventListener('keydown', function(e) {
          if ((e.code === 'Space' || e.code === 'Enter') && !shopeeClicked && !telegramClicked) {
            e.preventDefault();
            handleShopeeClick();
          }
        });
        
        // Auto redirect setelah 10 detik - HANYA JIKA BELUM PERNAH KLIK APAPUN
        setTimeout(() => {
          if (!shopeeClicked && !telegramClicked) {
            console.log('⏰ Auto redirect setelah 10 detik');
            handleShopeeClick();
          } else {
            console.log('⏰ Auto redirect dibatalkan karena udah pernah klik');
          }
        }, 10000);
        
        // Reset kalau balik ke halaman via back button
        window.addEventListener('pageshow', function(event) {
          if (event.persisted) {
            shopeeClicked = false;
            telegramClicked = false; // ⭐ INI PENTING! TELEGRAM DI RESET
            console.log('Back ke landing page, siap lagi!');
          }
        });
        
        console.log('✅ READY:');
        console.log('   - Klik area lain → Buka Shopee, langsung redirect');
        console.log('   - Klik JOIN TELE → Buka Telegram, back ke sini');
        console.log('   - Auto redirect 10 detik (kalau gak klik apa-apa)');
      </script>
    </body>
    </html>
    `;
