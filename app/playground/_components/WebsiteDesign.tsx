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

  // Initialize iframe shell once
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(baseHtml());
    doc.close();
  }, []);

  // Inject generated code and initialize libraries
  useEffect(() => {
    // Skip if code hasn't changed or is empty
    if (!generatedCode || prevCodeRef.current === generatedCode) return;

    // Clear any pending initialization
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

    // Delay initialization to ensure DOM is ready and reduce flickering
    initTimeoutRef.current = setTimeout(() => {
      try {
        // AOS Animation
        if (win.AOS?.init) {
          win.AOS.init();
        }

        // Swiper Initialization
        if (win.Swiper) {
          doc.querySelectorAll(".swiper-container").forEach((el) => {
            if (!(el instanceof HTMLElement)) return;
            try {
              new win.Swiper(el, {
                slidesPerView: 1,
                loop: true,
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                },
              });
            } catch (err) {
              console.error("Swiper init error:", err);
            }
          });
        }

        // Tippy Tooltips
        if (win.tippy) {
          doc.querySelectorAll("[data-tippy-content]").forEach((el) => {
            if (!(el instanceof HTMLElement)) return;
            try {
              win.tippy(el);
            } catch (err) {
              console.error("Tippy init error:", err);
            }
          });
        }

        // Chart.js
        if (win.Chart) {
          doc
            .querySelectorAll("canvas[data-chart='true']")
            .forEach((canvas) => {
              if (!(canvas instanceof HTMLCanvasElement)) return;
              if (canvas.dataset.inited) return;

              canvas.dataset.inited = "true";

              let labels = ["Red", "Blue", "Green"];
              let data = [12, 19, 3];

              try {
                if (canvas.dataset.labels)
                  labels = JSON.parse(canvas.dataset.labels);
                if (canvas.dataset.data) data = JSON.parse(canvas.dataset.data);
              } catch (err) {
                console.error("Chart parse error:", err);
              }

              try {
                new win.Chart(canvas.getContext("2d"), {
                  type: canvas.dataset.type || "bar",
                  data: {
                    labels,
                    datasets: [
                      {
                        label: "Data",
                        data,
                        backgroundColor: "rgba(59,130,246,0.7)",
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      legend: { display: true },
                      tooltip: { enabled: true },
                    },
                  },
                });
              } catch (err) {
                console.error("Chart render error:", err);
              }
            });
        }

        // Hide loading with smooth transition
        setTimeout(() => setIsLoading(false), 100);
      } catch (error) {
        console.error("Library initialization error:", error);
        setIsLoading(false);
      }
    }, 150);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [generatedCode]);

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

      // Clear previous hover
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

      // Deselect previous element
      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      // Add blur listener to the selected element
      selectedEl.addEventListener("blur", handleBlur);
      setSelectedElement(selectedEl);
    };

    const handleBlur = () => {
      if (selectedEl) {
        console.log("Final edited element:", selectedEl.outerHTML);
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

    // Add event listeners
    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount or when generatedCode changes
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);

      // Clean up any remaining outlines
      if (hoverEl) hoverEl.style.outline = "";
      if (selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
      }
    };
  }, [generatedCode]);

  const handleScreenSizeChange = useCallback((size: string) => {
    setSelectedScreenSize(size);
  }, []);

  useEffect(() => {
    onSaveData && onSaveCode();
  }, [onSaveData]);

  const saveGeneratedCode = useCallback(
    async (code: string) => {
      try {
        await axios.put("/api/frames", {
          designCode: code,
          frameId,
          projectId,
        });
        toast.success("Website saved successfully!");
      } catch (error) {
        console.error("Failed to save generated code:", error);
      }
    },
    [frameId, projectId]
  );

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
          console.log(html);
          saveGeneratedCode(html);
        }
      } catch (error) {}
    }
  };

  return (
    <section className="w-full flex flex-col items-center p-4">
      <div className="w-full flex gap-4">
        <div className="w-full flex flex-col justify-center relative">
          {/* AI Generation Loading Overlay (Full Screen) */}
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
                {/* Animated dots */}
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

          {/* Rendering Loading Overlay (Subtle) */}
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

          {/* Empty State */}
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

        {/* Side Panel for Element Editing */}
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
