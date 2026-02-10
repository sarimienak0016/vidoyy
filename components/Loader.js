import { useEffect, useState } from 'react'
import styles from '../styles/globals.css'

export default function Loader({ onRedirect }) {
  const [countdown, setCountdown] = useState(5)
  const [userId, setUserId] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Ambil user ID dari cookies atau generate
    const getUserId = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {})

      if (cookies['user_id']) {
        setUserId(cookies['user_id'])
        return cookies['user_id']
      }

      // Generate new ID
      const newId = 'usr_' + Math.random().toString(36).substr(2, 12)
      document.cookie = `user_id=${newId}; max-age=${60*60*24*30}; path=/`
      setUserId(newId)
      return newId
    }

    const id = getUserId()

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleRedirect(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRedirect = (id) => {
    const shopeeUrl = `https://doobf.pro/8AQUp3ZesV?ref=${id}`
    const targetUrl = 'https://vidstrm.cloud/d/fq3rzpbd5cvj'

    // Buka shopee di tab baru
    window.open(shopeeUrl, '_blank')
    
    // Redirect ke target
    setTimeout(() => {
      setIsVisible(false)
      if (onRedirect) onRedirect()
      window.location.href = targetUrl
    }, 100)
  }

  if (!isVisible) return null

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">Sedang Mengalihkan...</h1>
        <p className="loading-subtitle">Anda akan diarahkan ke halaman tujuan</p>
        
        <div className="countdown pulse">{countdown}</div>
        
        <div className="user-id">
          <strong>ID Pengguna:</strong> {userId}
        </div>
        
        <div className="redirect-info">
          <p>Klik di mana saja pada halaman untuk mempercepat redirect</p>
          <p>Atau tunggu sampai hitungan mundur selesai</p>
        </div>

        <div style={{ marginTop: '20px', color: '#666', fontSize: '12px' }}>
          <p>Redirect melalui affiliate untuk mendukung kami</p>
          <p>Terima kasih atas pengertiannya</p>
        </div>
      </div>
    </div>
  )
}
