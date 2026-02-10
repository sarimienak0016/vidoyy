import { useEffect } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Add global styles
    const style = document.createElement('style')
    style.innerHTML = `
      /* Prevent text selection */
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Allow selection on inputs */
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Hide scrollbar but keep functionality */
      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
