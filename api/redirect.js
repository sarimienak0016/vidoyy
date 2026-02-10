const { parse } = require('url');

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);
  const path = req.url;
  
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
  
  // HTML sederhana dengan overlay
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting...</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #000;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          cursor: pointer;
          overflow: hidden;
        }
        .overlay {
          background: #EE4D2D;
          color: white;
          padding: 40px;
          border-radius: 10px;
          text-align: center;
          max-width: 500px;
          width: 90%;
        }
        .icon {
          font-size: 50px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 22px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .btn {
          background: white;
          color: #EE4D2D;
          padding: 12px 30px;
          border-radius: 5px;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          margin-top: 10px;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="overlay" id="overlay">
        <div class="icon">👉</div>
        <h1>KLIK UNTUK MELANJUTKAN KE SHOPEE</h1>
        <p>Klik dimanapun di layar ini</p>
        <div class="btn" id="click-btn">KLIK DISINI</div>
      </div>
      
      <script>
        const links = ${JSON.stringify(AFFILIATE_LINKS)};
        
        function openShopee() {
          const randomLink = links[Math.floor(Math.random() * links.length)];
          window.location.href = randomLink;
        }
        
        // Klik overlay
        document.getElementById('overlay').addEventListener('click', function() {
          openShopee();
        });
        
        // Klik tombol
        document.getElementById('click-btn').addEventListener('click', function(e) {
          e.stopPropagation();
          openShopee();
        });
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
