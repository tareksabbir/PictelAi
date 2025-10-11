export const htmlContentFunction = (cleanedCode: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Generated Website</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
          <script src="https://unpkg.com/lucide@latest"></script>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
          <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
          <script src="https://unpkg.com/@popperjs/core@2"></script>
          <script src="https://unpkg.com/tippy.js@6"></script>
        </head>
        <body class="bg-white">
          ${cleanedCode}
          <script>
            // Initialize libraries after DOM is loaded
            window.addEventListener('load', function() {
              // Lucide icons
              if (window.lucide) {
                lucide.createIcons();
              }
              
              // AOS animations
              if (window.AOS) {
                AOS.init();
              }
              
              // Tippy tooltips
              if (window.tippy) {
                tippy('[data-tippy-content]');
              }
              
              // Swiper
              if (window.Swiper) {
                document.querySelectorAll('.swiper-container').forEach(function(el) {
                  new Swiper(el, {
                    slidesPerView: 1,
                    loop: true,
                    pagination: { el: '.swiper-pagination', clickable: true },
                    navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev'
                    }
                  });
                });
              }
              
              // Chart.js initialization
              if (window.Chart) {
                document.querySelectorAll('canvas[data-chart="true"]').forEach(function(canvas) {
                  if (canvas.dataset.inited) return;
                  canvas.dataset.inited = 'true';
                  
                  let labels = ['Red', 'Blue', 'Green'];
                  let data = [12, 19, 3];
                  
                  try {
                    if (canvas.dataset.labels) labels = JSON.parse(canvas.dataset.labels);
                    if (canvas.dataset.data) data = JSON.parse(canvas.dataset.data);
                  } catch (err) {
                    console.error('Chart parse error:', err);
                  }
                  
                  new Chart(canvas.getContext('2d'), {
                    type: canvas.dataset.type || 'bar',
                    data: {
                      labels: labels,
                      datasets: [{
                        label: 'Data',
                        data: data,
                        backgroundColor: 'rgba(59,130,246,0.7)'
                      }]
                    },
                    options: {
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true }
                      }
                    }
                  });
                });
              }
            });
          </script>
        </body>
      </html>
    `
};