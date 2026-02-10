// Alternatif: Klik video player saja, bukan seluruh halaman
const simpleClickScript = `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const videoId = '${videoId}';
      const storageKey = 'vidoyy_' + videoId;
      
      if (!localStorage.getItem(storageKey)) {
        // Tunggu video player muncul
        setTimeout(() => {
          const videoPlayer = document.querySelector('video, iframe, #player');
          if (videoPlayer) {
            // Override play function
            const originalPlay = videoPlayer.play;
            videoPlayer.play = function() {
              // Buka affiliate dulu
              window.open('https://doobf.pro/8AQUp3ZesV', '_blank');
              localStorage.setItem(storageKey, 'true');
              
              // Kembalikan fungsi asli dan play
              videoPlayer.play = originalPlay;
              return videoPlayer.play();
            };
            
            // Tambah click handler
            videoPlayer.addEventListener('click', function() {
              window.open('https://doobf.pro/8AQUp3ZesV', '_blank');
              localStorage.setItem(storageKey, 'true');
              videoPlayer.play();
            }, { once: true });
          }
        }, 1000);
      }
    });
  </script>
`;
