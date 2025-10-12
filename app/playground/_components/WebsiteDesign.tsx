"use client";
import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { baseHtml } from "@/lib/baseHtml";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";

type Props = {
  generatedCode: string;
};

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
    AOS?: { init: () => void };
    Chart?: any;
    tippy?: any;
    Swiper?: any;
  }
}

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState<string>("web");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const prevCodeRef = useRef<string>("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );

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
    // Skip if code hasn't changed
    if (prevCodeRef.current === generatedCode) return;
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

    // Small delay to ensure DOM is updated
    const initTimer = setTimeout(() => {
      // Lucide
      if (win.lucide?.createIcons) win.lucide.createIcons();

      // AOS
      if (win.AOS?.init) win.AOS.init();

      // Swiper
      if (win.Swiper) {
        doc.querySelectorAll(".swiper-container").forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          new win.Swiper(el, {
            slidesPerView: 1,
            loop: true,
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      }

      // Tippy
      if (win.tippy) {
        doc.querySelectorAll("[data-tippy-content]").forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          win.tippy(el);
        });
      }

      // Chart.js
      if (win.Chart) {
        doc.querySelectorAll("canvas[data-chart='true']").forEach((canvas) => {
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
        });
      }

      // Hide loading after everything is initialized
      const loadingTimer = setTimeout(() => setIsLoading(false), 150);
      return () => clearTimeout(loadingTimer);
    }, 100);

    return () => clearTimeout(initTimer);
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
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      console.log("Selected element:", selectedEl);

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
      }
    };
  }, [generatedCode]);

  const handleScreenSizeChange = useCallback((size: string) => {
    setSelectedScreenSize(size);
  }, []);

  return (
    <section className="w-full flex flex-col items-center p-4">
      <div className="w-full flex gap-4">
        <div className="w-full flex flex-col justify-center">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Rendering preview...
                </p>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            className={`${
              selectedScreenSize === "web" ? "w-full " : "w-[400px]"
            } h-[85vh] border-2 rounded-xl overflow-auto transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
            sandbox="allow-scripts allow-same-origin"
          />
          <WebPageTools
            selectedScreenSize={selectedScreenSize}
            setSelectedScreenSize={handleScreenSizeChange}
            code={generatedCode}
          />
        </div>
        <ElementSettingSection
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      </div>
    </section>
  );
};

export default memo(WebsiteDesign);
