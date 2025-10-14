"use client";
import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useContext,
} from "react";
import { baseHtml } from "@/lib/baseHtml";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  generatedCode: string;
  isGenerating?: boolean;
};

declare global {
  interface Window {
    AOS?: { init: () => void };
    Chart?: any;
    tippy?: any;
    Swiper?: any;
  }
}

const WebsiteDesign = ({ generatedCode, isGenerating = false }: Props) => {
  const { onSaveData, setOnSaveData } = useContext(OnSaveContext);
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState<string>("web");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevCodeRef = useRef<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize iframe shell once
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(baseHtml());
    doc.close();
  }, []);

  // Auto-save function
  const saveGeneratedCode = useCallback(
    async (code: string) => {
      try {
        await axios.put("/api/frames", {
          designCode: code,
          frameId,
          projectId,
        });
        console.log("[Auto-save] Website saved successfully");
      } catch (error) {
        console.error("[Auto-save] Failed to save:", error);
      }
    },
    [frameId, projectId]
  );

  // Debounced auto-save (saves 2 seconds after last change)
  const triggerAutoSave = useCallback(
    (code: string) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveGeneratedCode(code);
      }, 2000); // Auto-save 2 seconds after last change
    },
    [saveGeneratedCode]
  );

  // Wait for libraries to load in iframe
  const waitForLibraries = (win: Window): Promise<void> => {
    return new Promise((resolve) => {
      const checkLibraries = () => {
        if (win.Chart && win.AOS && win.Swiper && win.tippy) {
          resolve();
        } else {
          setTimeout(checkLibraries, 100);
        }
      };
      checkLibraries();
    });
  };

  // Main code injection and initialization effect
  useEffect(() => {
    if (!generatedCode || prevCodeRef.current === generatedCode) return;

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    prevCodeRef.current = generatedCode;
    setIsLoading(true);

    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument || !iframe.contentWindow) return;

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;

    const root = doc.getElementById("root");
    if (!root) return;

    // Clean and inject HTML
    root.innerHTML = generatedCode.replace(/```(html)?/g, "").trim();

    // Trigger auto-save when code changes
    triggerAutoSave(generatedCode);

    // Wait for all libraries to load
    const checkLibraries = () => {
      return new Promise<void>((resolve) => {
        const check = () => {
          if (win.Chart && win.AOS && win.Swiper && win.tippy) {
            resolve();
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    };

    checkLibraries()
      .then(() => {
        return new Promise((resolve) => setTimeout(resolve, 200));
      })
      .then(() => {
        console.log("[Init] Starting initialization...");

        // 1. AOS
        if (win.AOS?.init) {
          //@ts-ignore
          win.AOS.init({ duration: 800, once: true });
          console.log("[Init] ✓ AOS");
        }

        // 2. Tippy
        if (win.tippy) {
          const tippyEls = doc.querySelectorAll("[data-tippy-content]");
          if (tippyEls.length > 0) {
            tippyEls.forEach((el) => {
              try {
                win.tippy(el, { theme: "light", animation: "fade" });
              } catch (e) {
                console.error("Tippy element error:", e);
              }
            });
            console.log(`[Init] ✓ Tippy (${tippyEls.length} elements)`);
          }
        }

        // 3. Swiper
        if (win.Swiper) {
          const swiperContainers = doc.querySelectorAll(
            ".swiper-container, .swiper"
          );
          swiperContainers.forEach((container, idx) => {
            try {
              new win.Swiper(container, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                pagination: {
                  el: container.querySelector(".swiper-pagination"),
                  clickable: true,
                },
                navigation: {
                  nextEl: container.querySelector(".swiper-button-next"),
                  prevEl: container.querySelector(".swiper-button-prev"),
                },
                breakpoints: {
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                },
              });
              console.log(`[Init] ✓ Swiper #${idx + 1}`);
            } catch (e) {
              console.error(`Swiper #${idx + 1} error:`, e);
            }
          });
        }

        // 4. Chart.js - FIXED: Use consistent attribute name
        if (win.Chart) {
          const canvases = doc.querySelectorAll('canvas[data-chart="true"]');
          console.log(`[Charts] Found ${canvases.length} canvases`);

          canvases.forEach((canvas, idx) => {
            if (!(canvas instanceof HTMLCanvasElement)) {
              console.warn(`Element ${idx} is not a canvas`);
              return;
            }

            // FIXED: Use 'chartInitialized' instead of mixing 'initialized' and 'inited'
            if (canvas.dataset.chartInitialized === "true") {
              console.log(`[Charts] Canvas #${idx + 1} already initialized`);
              return;
            }

            try {
              const chartType = canvas.dataset.type || "bar";
              let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
              let dataValues = [12, 19, 15, 22, 18, 25];
              let datasetLabel = canvas.dataset.label || "Data";

              if (canvas.dataset.labels) {
                try {
                  labels = JSON.parse(canvas.dataset.labels);
                } catch (e) {
                  console.warn(`Failed to parse labels for canvas #${idx + 1}`);
                }
              }

              if (canvas.dataset.data) {
                try {
                  dataValues = JSON.parse(canvas.dataset.data);
                } catch (e) {
                  console.warn(`Failed to parse data for canvas #${idx + 1}`);
                }
              }

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                console.error(
                  `Failed to get 2D context for canvas #${idx + 1}`
                );
                return;
              }

              // Destroy existing chart
              const existingChart = win.Chart.getChart(canvas);
              if (existingChart) {
                existingChart.destroy();
              }

              const multiColors = [
                "rgba(255, 99, 132, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)",
                "rgba(255, 205, 86, 0.7)",
              ];

              const blueColor = {
                background: "rgba(37, 99, 235, 0.7)",
                border: "rgba(37, 99, 235, 1)",
              };

              let datasets;
              if (chartType === "pie" || chartType === "doughnut") {
                datasets = [
                  {
                    label: datasetLabel,
                    data: dataValues,
                    backgroundColor: multiColors,
                    borderColor: multiColors.map((c) => c.replace("0.7", "1")),
                    borderWidth: 2,
                  },
                ];
              } else {
                datasets = [
                  {
                    label: datasetLabel,
                    data: dataValues,
                    backgroundColor: blueColor.background,
                    borderColor: blueColor.border,
                    borderWidth: 2,
                    tension: chartType === "line" ? 0.4 : 0,
                    fill: chartType === "line",
                  },
                ];
              }

              new win.Chart(ctx, {
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
                      position: "top",
                      labels: {
                        padding: 15,
                        font: { size: 12, weight: "500" },
                        usePointStyle: true,
                      },
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: 12,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: "bold" },
                      bodyFont: { size: 13 },
                    },
                  },
                  scales:
                    chartType === "bar" || chartType === "line"
                      ? {
                          y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0, 0, 0, 0.05)" },
                            ticks: { font: { size: 11 } },
                          },
                          x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } },
                          },
                        }
                      : undefined,
                },
              });

              // FIXED: Use consistent attribute name
              canvas.dataset.chartInitialized = "true";
              console.log(
                `[Charts] ✓ Chart #${idx + 1} created (${chartType})`
              );
            } catch (error) {
              console.error(
                `[Charts] ✗ Error creating chart #${idx + 1}:`,
                error
              );
            }
          });
        } else {
          console.error("[Charts] Chart.js not available");
        }

        // 5. Image error handling
        const images = doc.querySelectorAll("img");
        images.forEach((img, idx) => {
          img.classList.add("loading");

          img.addEventListener("load", function () {
            this.classList.remove("loading");
            this.classList.add("loaded");
          });

          img.addEventListener("error", function () {
            console.warn(
              `[Images] Failed to load image #${idx + 1}:`,
              this.src
            );
            this.src = `https://placehold.co/600x400/e5e7eb/64748b?text=Image+${
              idx + 1
            }`;
            this.classList.remove("loading");
            this.classList.add("loaded");
          });
        });

        // 6. Flowbite
        //@ts-ignore
        if (typeof win.initFlowbite !== "undefined") {
          try {
            //@ts-ignore
            win.initFlowbite();
            console.log("[Init] ✓ Flowbite");
          } catch (e) {
            console.error("[Init] ✗ Flowbite error:", e);
          }
        }

        console.log("[Init] ✓ All libraries initialized");

        setTimeout(() => setIsLoading(false), 150);
      })
      .catch((error) => {
        console.error("[Init] Failed to initialize:", error);
        setIsLoading(false);
      });

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [generatedCode, triggerAutoSave]);

  // Interactive element selection feature
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;

      if (hoverEl && hoverEl !== target) {
        hoverEl.style.outline = "";
      }

      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      selectedEl.addEventListener("blur", handleBlur);
      setSelectedElement(selectedEl);
    };

    const handleBlur = () => {
      if (selectedEl && iframeRef.current?.contentDocument) {
        // Auto-save when element is edited
        const root = iframeRef.current.contentDocument.getElementById("root");
        if (root) {
          triggerAutoSave(root.innerHTML);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
        selectedEl = null;
        setSelectedElement(null);
      }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);

      if (hoverEl) hoverEl.style.outline = "";
      if (selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
      }
    };
  }, [generatedCode, triggerAutoSave]);

  const handleScreenSizeChange = useCallback((size: string) => {
    setSelectedScreenSize(size);
  }, []);

  // Manual save handler (for save button)
  useEffect(() => {
    onSaveData && onSaveCode();
  }, [onSaveData]);

  const onSaveCode = async () => {
    if (iframeRef.current) {
      try {
        const iframeDoc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          const cloneDoc = iframeDoc.documentElement.cloneNode(
            true
          ) as HTMLElement;
          const allelements = cloneDoc.querySelectorAll<HTMLElement>("*");
          allelements.forEach((element) => {
            element.style.outline = "";
            element.style.cursor = "";
          });
          const html = cloneDoc.outerHTML;
          await saveGeneratedCode(html);
          toast.success("Website saved successfully!");
        }
      } catch (error) {
        console.error("Manual save error:", error);
        toast.error("Failed to save website");
      }
    }
  };

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="w-full flex flex-col items-center p-4">
      <div className="w-full flex gap-4">
        <div className="w-full flex flex-col justify-center relative">
          {isGenerating && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center gap-4 p-8 bg-white/80 rounded-2xl shadow-lg">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    AI is crafting your website...
                  </p>
                  <p className="text-sm text-gray-600">
                    This may take a few moments
                  </p>
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {isLoading && !isGenerating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-gray-200 rounded-full"></div>
                  <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Rendering...
                </p>
              </div>
            </div>
          )}

          {!generatedCode && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-lg">
                    No preview available
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start chatting to generate your website
                  </p>
                </div>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            className={`${
              selectedScreenSize === "web" ? "w-full" : "w-[420px] mx-auto"
            } h-[85vh] border-2 rounded-xl overflow-auto transition-all duration-300 ${
              isLoading || isGenerating ? "opacity-40" : "opacity-100"
            }`}
            sandbox="allow-scripts allow-same-origin"
          />

          <WebPageTools
            selectedScreenSize={selectedScreenSize}
            setSelectedScreenSize={handleScreenSizeChange}
            code={generatedCode}
          />
        </div>

        {selectedElement?.tagName === "IMG" ? (
          //@ts-ignore
          <ImageSettingSection selectedEl={selectedElement} />
        ) : selectedElement ? (
          <ElementSettingSection
            selectedEl={selectedElement}
            clearSelection={() => setSelectedElement(null)}
          />
        ) : null}
      </div>
    </section>
  );
};

export default memo(WebsiteDesign);
