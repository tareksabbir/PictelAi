export const baseHtml = () => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Website Builder</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#2563eb',
              accent: '#1e40af',
            },
            fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
          },
        },
      };
    </script>

    <!-- Flowbite -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Iconify -->
    <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Animation Libraries -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Swiper -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Tooltips -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #ffffff;
        color: #1e293b;
      }
      
      [data-aos] {
        transition-property: transform, opacity;
      }

      /* Image fallback styling */
      img[src=""], img:not([src]), img[src*="placeholder"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: inline-block;
        position: relative;
      }

      /* Loading state for images */
      img.loading {
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }

      img.loaded {
        opacity: 1;
      }

      /* Chart container responsive fix */
      canvas {
        max-width: 100%;
        height: auto !important;
      }

      .chart-container {
        position: relative;
        width: 100%;
        min-height: 300px;
      }
    </style>
  </head>

  <body id="root" class="bg-white text-slate-800">
    <!-- Generated content will be injected here -->
    
    <script>
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', function() {
        console.log('[Init] DOM Content Loaded');
        
        // Initialize libraries after a short delay to ensure content is rendered
        setTimeout(initializeLibraries, 100);
      });

      function initializeLibraries() {
        console.log('[Init] Starting library initialization');

        // 1. Initialize AOS Animations
        if (typeof AOS !== 'undefined') {
          try {
            AOS.init({ 
              duration: 800, 
              once: true,
              offset: 50,
              delay: 100
            });
            console.log('[Init] ✓ AOS initialized');
          } catch (e) {
            console.error('[Init] ✗ AOS error:', e);
          }
        }

        // 2. Initialize Tippy Tooltips
        if (typeof tippy !== 'undefined') {
          try {
            const tippyElements = document.querySelectorAll('[data-tippy-content]');
            if (tippyElements.length > 0) {
              tippy('[data-tippy-content]', {
                theme: 'light',
                animation: 'fade',
              });
              console.log(\`[Init] ✓ Tippy initialized (\${tippyElements.length} elements)\`);
            }
          } catch (e) {
            console.error('[Init] ✗ Tippy error:', e);
          }
        }

        // 3. Initialize Swiper Sliders
        if (typeof Swiper !== 'undefined') {
          try {
            const swiperContainers = document.querySelectorAll('.swiper-container, .swiper');
            swiperContainers.forEach((container, index) => {
              try {
                new Swiper(container, {
                  slidesPerView: 1,
                  spaceBetween: 30,
                  loop: true,
                  autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                  },
                  pagination: {
                    el: container.querySelector('.swiper-pagination'),
                    clickable: true,
                  },
                  navigation: {
                    nextEl: container.querySelector('.swiper-button-next'),
                    prevEl: container.querySelector('.swiper-button-prev'),
                  },
                  breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  },
                });
                console.log(\`[Init] ✓ Swiper #\${index + 1} initialized\`);
              } catch (e) {
                console.error(\`[Init] ✗ Swiper #\${index + 1} error:\`, e);
              }
            });
          } catch (e) {
            console.error('[Init] ✗ Swiper error:', e);
          }
        }

        // 4. Initialize Chart.js
        if (typeof Chart !== 'undefined') {
          initializeCharts();
        } else {
          console.error('[Init] ✗ Chart.js not loaded');
        }

        // 5. Initialize Image Error Handlers
        initializeImageHandlers();

        // 6. Initialize Flowbite components
        if (typeof initFlowbite !== 'undefined') {
          try {
            initFlowbite();
            console.log('[Init] ✓ Flowbite initialized');
          } catch (e) {
            console.error('[Init] ✗ Flowbite error:', e);
          }
        }

        console.log('[Init] All libraries initialized');
      }

      function initializeCharts() {
        const canvases = document.querySelectorAll('canvas[data-chart="true"]');
        console.log(\`[Charts] Found \${canvases.length} chart canvases\`);

        canvases.forEach((canvas, index) => {
          if (canvas.dataset.chartInitialized === 'true'){
            console.log(\`[Charts] Canvas #\${index + 1} already initialized\`);
            return;
          }

          try {
            // Get chart configuration from data attributes
            const chartType = canvas.dataset.type || 'bar';
            let labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            let dataValues = [12, 19, 3, 5, 2, 3];
            let datasetLabel = 'Dataset';

            // Parse custom data if provided
            try {
              if (canvas.dataset.labels) {
                labels = JSON.parse(canvas.dataset.labels);
              }
              if (canvas.dataset.data) {
                dataValues = JSON.parse(canvas.dataset.data);
              }
              if (canvas.dataset.label) {
                datasetLabel = canvas.dataset.label;
              }
            } catch (parseError) {
              console.warn(\`[Charts] Parse error for canvas #\${index + 1}, using defaults\`, parseError);
            }

            // Get 2D context
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error(\`[Charts] Failed to get 2D context for canvas #\${index + 1}\`);
              return;
            }

            // Destroy existing chart if present
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
              existingChart.destroy();
            }

            // Chart color schemes
            const colorSchemes = {
              blue: {
                background: 'rgba(37, 99, 235, 0.7)',
                border: 'rgba(37, 99, 235, 1)',
              },
              gradient: [
                { background: 'rgba(59, 130, 246, 0.7)', border: 'rgba(59, 130, 246, 1)' },
                { background: 'rgba(147, 51, 234, 0.7)', border: 'rgba(147, 51, 234, 1)' },
                { background: 'rgba(236, 72, 153, 0.7)', border: 'rgba(236, 72, 153, 1)' },
              ],
              multi: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 205, 86, 0.7)',
              ]
            };

            // Prepare dataset based on chart type
            let datasets;
            if (chartType === 'pie' || chartType === 'doughnut') {
              datasets = [{
                label: datasetLabel,
                data: dataValues,
                backgroundColor: colorSchemes.multi,
                borderColor: colorSchemes.multi.map(c => c.replace('0.7', '1')),
                borderWidth: 2,
              }];
            } else {
              datasets = [{
                label: datasetLabel,
                data: dataValues,
                backgroundColor: colorSchemes.blue.background,
                borderColor: colorSchemes.blue.border,
                borderWidth: 2,
                tension: 0.4,
                fill: chartType === 'line' ? true : false,
              }];
            }

            // Create chart
            new Chart(ctx, {
              type: chartType,
              data: {
                labels: labels,
                datasets: datasets,
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      padding: 15,
                      font: { size: 12, weight: '500' },
                      usePointStyle: true,
                    }
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                  },
                },
                scales: (chartType === 'bar' || chartType === 'line') ? {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                  }
                } : undefined,
              },
            });

            canvas.dataset.chartInitialized = 'true';
            console.log(\`[Charts] ✓ Chart #\${index + 1} initialized (type: \${chartType})\`);
          } catch (error) {
            console.error(\`[Charts] ✗ Error initializing chart #\${index + 1}:\`, error);
          }
        });
      }

      function initializeImageHandlers() {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          img.classList.add('loading');
          
          img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
          });

          img.addEventListener('error', function() {
            console.warn(\'[Images] Failed to load image #\${index + 1}:', this.src);
            // Use a reliable placeholder service
            this.src = \`https://placehold.co/600x400/e5e7eb/64748b?text=Image+\${index + 1}\`;
            this.classList.remove('loading');
            this.classList.add('loaded');
          });
        });
      }

      // Reinitialize on dynamic content changes
      const observer = new MutationObserver(function(mutations) {
        let shouldReinit = false;
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Element node
                if (node.querySelector && (
                    node.querySelector('canvas[data-chart="true"]') ||
                    node.querySelector('.swiper-container') ||
                    node.querySelector('[data-tippy-content]') ||
                    node.tagName === 'CANVAS' ||
                    node.classList?.contains('swiper-container')
                )) {
                  shouldReinit = true;
                }
              }
            });
          }
        });
        
        if (shouldReinit) {
          console.log('[Init] Content changed, reinitializing...');
          setTimeout(initializeLibraries, 200);
        }
      });

      // Observe the root element
      if (document.getElementById('root')) {
        observer.observe(document.getElementById('root'), {
          childList: true,
          subtree: true,
        });
      }
    </script>
  </body>
</html>
`;
};
