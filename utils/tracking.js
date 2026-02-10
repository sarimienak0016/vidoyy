// Utility untuk tracking dan ID management
export class TrackingManager {
  constructor() {
    this.userId = null
    this.sessionId = null
    this.init()
  }

  init() {
    this.loadUserId()
    this.generateSessionId()
    this.setupEventListeners()
  }

  loadUserId() {
    // Cek dari cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {})

      if (cookies['user_id']) {
        this.userId = cookies['user_id']
        return
      }
    }

    // Cek dari localStorage
    if (typeof localStorage !== 'undefined') {
      const storedId = localStorage.getItem('user_id')
      if (storedId) {
        this.userId = storedId
        return
      }
    }

    // Generate baru
    this.generateUserId()
  }

  generateUserId() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 9)
    this.userId = `usr_${timestamp}_${random}`
    
    // Simpan di cookies
    if (typeof document !== 'undefined') {
      document.cookie = `user_id=${this.userId}; max-age=${60*60*24*30}; path=/`
    }
    
    // Simpan di localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user_id', this.userId)
    }
    
    console.log('Generated new User ID:', this.userId)
  }

  generateSessionId() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.sessionId = `sess_${timestamp}_${random}`
    
    // Simpan session ID
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('session_id', this.sessionId)
    }
  }

  setupEventListeners() {
    if (typeof window === 'undefined') return

    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackClick(e)
    }, true)

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackVisibility()
    })

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.trackExit()
    })
  }

  trackClick(event) {
    const clickData = {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      element: event.target.tagName,
      className: event.target.className,
      id: event.target.id,
      x: event.clientX,
      y: event.clientY,
      url: window.location.href
    }

    // Kirim data ke API (simulasi)
    this.sendTrackingData('click', clickData)
    
    // Untuk debugging
    console.log('Click tracked:', clickData)
  }

  trackVisibility() {
    const visibilityData = {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      visibilityState: document.visibilityState,
      hidden: document.hidden
    }

    this.sendTrackingData('visibility', visibilityData)
  }

  trackExit() {
    const exitData = {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      type: 'page_exit',
      timeOnPage: performance.now()
    }

    // Gunakan navigator.sendBeacon untuk data exit
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(exitData)], {type: 'application/json'})
      navigator.sendBeacon('/api/track', blob)
    }
  }

  sendTrackingData(eventType, data) {
    // Simpan di localStorage sebagai backup
    if (typeof localStorage !== 'undefined') {
      const trackingLogs = JSON.parse(localStorage.getItem('tracking_logs') || '[]')
      trackingLogs.push({
        event: eventType,
        ...data,
        sent: false
      })
      localStorage.setItem('tracking_logs', JSON.stringify(trackingLogs.slice(-100))) // Simpan 100 event terakhir
    }

    // Kirim ke API (bisa diimplementasikan nanti)
    // fetch('/api/track', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(data)
    // })
  }

  getShopeeAffiliateLink() {
    const baseUrl = process.env.NEXT_PUBLIC_SHOPEE_AFFILIATE || 'https://doobf.pro/8AQUp3ZesV'
    return `${baseUrl}?ref=${this.userId}&session=${this.sessionId}&source=redirect_app`
  }

  getTargetUrl() {
    return process.env.NEXT_PUBLIC_TARGET_URL || 'https://vidstrm.cloud/d/fq3rzpbd5cvj'
  }
}

// Singleton instance
let trackingManagerInstance = null

export function getTrackingManager() {
  if (!trackingManagerInstance) {
    trackingManagerInstance = new TrackingManager()
  }
  return trackingManagerInstance
}
