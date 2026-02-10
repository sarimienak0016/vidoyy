import { useEffect, useState } from 'react'
import Head from 'next/head'
import Loader from '../components/Loader'
import { getTrackingManager } from '../utils/tracking'
import '../styles/globals.css'

export default function Home() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [trackingManager, setTrackingManager] = useState(null)

  useEffect(() => {
    // Initialize tracking
    const tm = getTrackingManager()
    setTrackingManager(tm)

    const loadContent = async () => {
      try {
        // Coba proxy dulu
        const proxyResponse = await fetch(`/api/proxy?url=https://vidstrm.cloud/d/fq3rzpbd5cvj&t=${Date.now()}`)
        
        if (proxyResponse.ok) {
          const html = await proxyResponse.text()
          setContent(html)
          setIsLoading(false)
          
          // Inject additional scripts setelah konten load
          setTimeout(() => {
            injectAdditionalScripts(tm)
          }, 100)
        } else {
          throw new Error('Proxy failed')
        }
      } catch (error) {
        console.error('Error loading content:', error)
        setHasError(true)
        setIsLoading(false)
        
        // Show fallback content
        setContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Redirect System</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                  background: #f5f5f5;
                }
                .header {
                  text-align: center;
                  padding: 40px;
                  background: white;
                  border-radius: 10px;
                  margin-bottom: 20px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .info-card {
                  background: white;
                  padding: 20px;
                  border-radius: 10px;
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Redirect System Active</h1>
                <p>Click anywhere to continue</p>
              </div>
              <div class="info-card">
                <h3>How it works:</h3>
                <ul>
                  <li>Click anywhere on this page</li>
                  <li>You'll be redirected through our affiliate link</li>
                  <li>Then to the destination page</li>
                </ul>
              </div>
            </body>
          </html>
        `)
      }
    }

    loadContent()

    // Setup global click handler sebagai backup
    const handleGlobalClick = (e) => {
      if (tm) {
        const shopeeUrl = tm.getShopeeAffiliateLink()
        const targetUrl = tm.getTargetUrl()
        
        // Open shopee in new tab
        window.open(shopeeUrl, '_blank')
        
        // Redirect current page
        setTimeout(() => {
          window.location.href = targetUrl
        }, 100)
      }
      
      e.preventDefault()
      e.stopPropagation()
    }

    document.addEventListener('click', handleGlobalClick, true)

    return () => {
      document.removeEventListener('click', handleGlobalClick, true)
    }
  }, [])

  const injectAdditionalScripts = (tm) => {
    if (typeof document === 'undefined') return

    const script = document.createElement('script')
    script.innerHTML = `
      // Enhanced tracking
      (function() {
        const userId = "${tm?.userId || 'unknown'}";
        const sessionId = "${tm?.sessionId || 'unknown'}";
        
        // Performance tracking
        const perfData = {
          userId: userId,
          sessionId: sessionId,
          pageLoadTime: performance.now(),
          timestamp: new Date().toISOString()
        };
        
        // Send performance data
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(perfData)], {type: 'application/json'});
          navigator.sendBeacon('/api/track', blob);
        }
        
        // Mouse movement tracking
        let mouseMoves = [];
        document.addEventListener('mousemove', (e) => {
          mouseMoves.push({
            x: e.clientX,
            y: e.clientY,
            t: Date.now()
          });
          
          // Keep only last 50 moves
          if (mouseMoves.length > 50) {
            mouseMoves = mouseMoves.slice(-50);
          }
        });
        
        // Scroll tracking
        let scrollDepth = 0;
        document.addEventListener('scroll', () => {
          const newDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
          if (newDepth > scrollDepth) {
            scrollDepth = newDepth;
          }
        });
        
        // Before unload - send all collected data
        window.addEventListener('beforeunload', () => {
          const exitData = {
            userId: userId,
            sessionId: sessionId,
            type: 'page_exit',
            scrollDepth: scrollDepth,
            mouseMoveCount: mouseMoves.length,
            timeSpent: performance.now() - perfData.pageLoadTime,
            timestamp: new Date().toISOString()
          };
          
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(exitData)], {type: 'application/json'});
            navigator.sendBeacon('/api/track', blob);
          }
        });
        
        console.log('Enhanced tracking activated for user:', userId);
      })();
    `
    
    document.body.appendChild(script)
  }

  const handleRedirectComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Redirect System - Auto ID Tracking</title>
        <meta name="description" content="Advanced redirect system with auto ID generation" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Redirect System" />
        <meta property="og:description" content="Advanced redirect with tracking" />
        <meta property="og:type" content="website" />
        
        {/* Analytics script bisa ditambahkan di sini */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global redirect handler
              window.GlobalRedirect = {
                userId: null,
                init: function() {
                  // Get or create user ID
                  this.userId = localStorage.getItem('user_id');
                  if (!this.userId) {
                    this.userId = 'usr_' + Math.random().toString(36).substr(2, 12);
                    localStorage.setItem('user_id', this.userId);
                    document.cookie = 'user_id=' + this.userId + '; max-age=' + (60*60*24*30) + '; path=/';
                  }
                  
                  // Set up global click handler
                  document.addEventListener('click', function(e) {
                    const shopeeUrl = 'https://doobf.pro/8AQUp3ZesV?ref=' + window.GlobalRedirect.userId;
                    window.open(shopeeUrl, '_blank');
                    
                    setTimeout(() => {
                      window.location.href = 'https://vidstrm.cloud/d/fq3rzpbd5cvj';
                    }, 100);
                    
                    e.preventDefault();
                    e.stopPropagation();
                  }, true);
                  
                  console.log('GlobalRedirect initialized with ID:', this.userId);
                }
              };
              
              // Initialize when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  window.GlobalRedirect.init();
                });
              } else {
                window.GlobalRedirect.init();
              }
            `
          }}
        />
      </Head>

      {isLoading && <Loader onRedirect={handleRedirectComplete} />}
      
      {/* Main content */}
      <div 
        id="main-content" 
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ 
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* Click overlay untuk memastikan klik tertangkap */}
      {!isLoading && !hasError && (
        <div 
          id="global-click-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999998,
            cursor: 'pointer',
            background: 'transparent'
          }}
          onClick={() => {
            if (trackingManager) {
              const shopeeUrl = trackingManager.getShopeeAffiliateLink()
              const targetUrl = trackingManager.getTargetUrl()
              
              window.open(shopeeUrl, '_blank')
              setTimeout(() => {
                window.location.href = targetUrl
              }, 100)
            }
          }}
        />
      )}

      {/* Notification */}
      <div id="notification" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#4CAF50',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: 1000000,
        display: isLoading ? 'none' : 'block',
        animation: 'slideIn 0.3s ease'
      }}>
        Click anywhere to continue
      </div>
    </>
  )
}
