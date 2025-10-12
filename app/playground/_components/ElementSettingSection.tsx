'use client';
import {
  SwatchBook,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

type Props = {
  selectedEl: HTMLElement | null; // allow null while nothing selected
  clearSelection: () => void;
};

function ElementSettingSection({ selectedEl, clearSelection }: Props) {
  // Classes manager
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");

  // Controlled style states
  const [fontSize, setFontSize] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [align, setAlign] = useState<string>("");
  const [background, setBackground] = useState<string>("#ffffff");
  const [borderRadius, setBorderRadius] = useState<string>("");
  const [padding, setPadding] = useState<string>("");
  const [margin, setMargin] = useState<string>("");

  const [fontFamily, setFontFamily] = useState<string>("inherit");
  const [fontWeight, setFontWeight] = useState<string>("400");
  const [letterSpacing, setLetterSpacing] = useState<string>("");
  const [lineHeight, setLineHeight] = useState<string>("");

  const [borderStyle, setBorderStyle] = useState<string>("none");
  const [borderWidth, setBorderWidth] = useState<string>("");
  const [borderColor, setBorderColor] = useState<string>("#000000");

  const [boxShadow, setBoxShadow] = useState<string>("none");
  const [opacity, setOpacity] = useState<string>("1");

  // Helper: apply style to element and keep state in sync
  const applyStyle = (property: string, value: string) => {
    if (!selectedEl) return;
    selectedEl.style[property as any] = value;
    // Keep local state mirrored for specific properties
    switch (property) {
      case "fontSize":
        setFontSize(value);
        break;
      case "color":
        setTextColor(value);
        break;
      case "textAlign":
        setAlign(value);
        break;
      case "backgroundColor":
        setBackground(value);
        break;
      case "borderRadius":
        setBorderRadius(value);
        break;
      case "padding":
        setPadding(value);
        break;
      case "margin":
        setMargin(value);
        break;
      case "fontFamily":
        setFontFamily(value);
        break;
      case "fontWeight":
        setFontWeight(value);
        break;
      case "letterSpacing":
        setLetterSpacing(value);
        break;
      case "lineHeight":
        setLineHeight(value);
        break;
      case "borderStyle":
        setBorderStyle(value);
        break;
      case "borderWidth":
        setBorderWidth(value);
        break;
      case "borderColor":
        setBorderColor(value);
        break;
      case "boxShadow":
        setBoxShadow(value);
        break;
      case "opacity":
        setOpacity(value);
        break;
      default:
        break;
    }
  };

  // Initialize states from selected element when it changes
  useEffect(() => {
    if (!selectedEl) {
      // clear UI when nothing selected
      setClasses([]);
      setFontSize("");
      setTextColor("#000000");
      setAlign("");
      setBackground("#ffffff");
      setBorderRadius("");
      setPadding("");
      setMargin("");
      setFontFamily("inherit");
      setFontWeight("400");
      setLetterSpacing("");
      setLineHeight("");
      setBorderStyle("none");
      setBorderWidth("");
      setBorderColor("#000000");
      setBoxShadow("none");
      setOpacity("1");
      return;
    }

    const style = selectedEl.style;

    setFontSize(style.fontSize || "");
    setTextColor(style.color || "#000000");
    setAlign(style.textAlign || "");
    setBackground(style.backgroundColor || "#ffffff");
    setBorderRadius(style.borderRadius || "");
    setPadding(style.padding || "");
    setMargin(style.margin || "");
    setFontFamily(style.fontFamily || "inherit");
    setFontWeight(style.fontWeight || (style.fontWeight === "" ? "400" : style.fontWeight));
    setLetterSpacing(style.letterSpacing || "");
    setLineHeight(style.lineHeight || "");
    setBorderStyle(style.borderStyle || "none");
    setBorderWidth(style.borderWidth || "");
    setBorderColor(style.borderColor || "#000000");
    setBoxShadow(style.boxShadow || "none");
    setOpacity(style.opacity || "1");

    // classes
    const currentClasses = selectedEl.className
      .split(" ")
      .filter((c) => c.trim() !== "");
    setClasses(currentClasses);

    // Observe class changes
    const observer = new MutationObserver(() => {
      const updated = selectedEl.className
        .split(" ")
        .filter((c) => c.trim() !== "");
      setClasses(updated);
    });

    observer.observe(selectedEl, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [selectedEl]);

  // Classes helpers
  const removeClass = (cls: string) => {
    if (!selectedEl) return;
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    selectedEl.className = updated.join(" ");
  };

  const addClass = () => {
    if (!selectedEl) return;
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      selectedEl.className = updated.join(" ");
    }
    setNewClass("");
  };

  // Robust reset: clear inline styles and reset local state (so UI updates)
  const resetStyles = () => {
    if (!selectedEl) return;
    // Clear all inline styles
    selectedEl.removeAttribute("style");

    // Reset local controlled states to defaults
    setFontSize("");
    setTextColor("#000000");
    setAlign("");
    setBackground("#ffffff");
    setBorderRadius("");
    setPadding("");
    setMargin("");
    setFontFamily("inherit");
    setFontWeight("400");
    setLetterSpacing("");
    setLineHeight("");
    setBorderStyle("none");
    setBorderWidth("");
    setBorderColor("#000000");
    setBoxShadow("none");
    setOpacity("1");
  };

  // small guard ui when no element selected
  if (!selectedEl) {
    return (
      <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2 bg-white">
        <h2 className="flex gap-2 items-center font-bold">
          <SwatchBook /> Settings
        </h2>
        <div className="text-sm text-gray-500">No element selected.</div>
      </div>
    );
  }

  return (
    <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2 bg-white">
      <h2 className="flex gap-2 items-center font-bold">
        <SwatchBook /> Settings
      </h2>

      {/* Font Size + Text Color */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm">Font Size</label>
          <Select
            value={fontSize || "24px"}
            onValueChange={(value) => applyStyle("fontSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((_, index) => {
                const val = index + 12 + "px";
                return (
                  <SelectItem value={val} key={index}>
                    {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm block">Text Color</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1"
            value={textColor}
            onChange={(event) => applyStyle("color", event.target.value)}
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={(v) => {
            // ToggleGroup may send null/undefined when deselected
            const newVal = v || "";
            applyStyle("textAlign", newVal);
          }}
          className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
        >
          <ToggleGroupItem value="left" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignLeft size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignCenter size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" className="p-2 rounded hover:bg-gray-200 flex-1">
            <AlignRight size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Background + Border Radius */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm block">Background</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1"
            value={background}
            onChange={(event) => applyStyle("backgroundColor", event.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm">Border Radius</label>
          <Input
            type="text"
            placeholder="e.g. 8px"
            value={borderRadius}
            onChange={(e) => applyStyle("borderRadius", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="text-sm">Padding</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          value={padding}
          onChange={(e) => applyStyle("padding", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Margin */}
      <div>
        <label className="text-sm">Margin</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          value={margin}
          onChange={(e) => applyStyle("margin", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Classes */}
      <div>
        <label className="text-sm font-medium">Classes</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <span
                key={cls}
                className="flex text-xs items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border"
              >
                {cls}
                <button
                  onClick={() => removeClass(cls)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No classes applied</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
          />
          <Button type="button" onClick={addClass}>
            Add
          </Button>
        </div>
      </div>

      {/* === New features === */}
      {/* Font Family */}
      <div>
        <label className="text-sm">Font Family</label>
        <Select
          value={fontFamily}
          onValueChange={(value) => applyStyle("fontFamily", value)}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {[
              "inherit",
              "Arial, sans-serif",
              "Roboto, sans-serif",
              "Inter, sans-serif",
              "Georgia, serif",
              "Times New Roman, serif",
              "Courier New, monospace",
              "Poppins, sans-serif",
            ].map((font) => (
              <SelectItem key={font} value={font}>
                {font.split(",")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-sm">Font Weight</label>
        <Select value={fontWeight} onValueChange={(value) => applyStyle("fontWeight", value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {["100","200","300","400","500","600","700","800","900"].map((w) => (
              <SelectItem key={w} value={w}>
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Letter Spacing & Line Height */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm">Letter Spacing</label>
          <Input
            type="text"
            placeholder="e.g. 1px"
            value={letterSpacing}
            onChange={(e) => applyStyle("letterSpacing", e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm">Line Height</label>
          <Input
            type="text"
            placeholder="e.g. 1.5"
            value={lineHeight}
            onChange={(e) => applyStyle("lineHeight", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Border Control */}
      <div>
        <label className="text-sm font-medium">Border</label>
        <div className="flex gap-2 mt-1 items-center">
          <Select value={borderStyle} onValueChange={(v) => applyStyle("borderStyle", v)}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {["none", "solid", "dashed", "dotted", "double"].map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            className="w-1/3"
            placeholder="Width (e.g. 2px)"
            value={borderWidth}
            onChange={(e) => applyStyle("borderWidth", e.target.value)}
          />
          <input
            type="color"
            className="w-[40px] h-[40px] rounded"
            value={borderColor}
            onChange={(e) => applyStyle("borderColor", e.target.value)}
          />
        </div>
      </div>

      {/* Box Shadow */}
      <div>
        <label className="text-sm">Box Shadow</label>
        <Select value={boxShadow} onValueChange={(v) => applyStyle("boxShadow", v)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select shadow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="0 1px 3px rgba(0,0,0,0.1)">Small Shadow</SelectItem>
            <SelectItem value="0 4px 6px rgba(0,0,0,0.15)">Medium Shadow</SelectItem>
            <SelectItem value="0 10px 15px rgba(0,0,0,0.2)">Large Shadow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opacity */}
      <div>
        <label className="text-sm">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => applyStyle("opacity", e.target.value)}
          className="w-full mt-2"
        />
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={resetStyles}
          className="flex gap-2 items-center"
        >
          <Trash2 size={16} /> Reset Styles
        </Button>
      </div>
    </div>
  );
}

export default ElementSettingSection;
