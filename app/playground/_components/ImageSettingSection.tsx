"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Crop,
  Image as ImageUpscale,
  ImageMinus,
  Loader2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  selectedEl: HTMLImageElement;
};

const transformOptions = [
  {
    label: "Smart Crop",
    value: "smartcrop",
    icon: <Crop />,
    transformation: "fo-auto",
  },
  {
    label: "Dropshadow",
    value: "dropshadow",
    icon: <ImageIcon />,
    transformation: "e-dropshadow",
  },
  {
    label: "Upscale",
    value: "upscale",
    icon: <ImageUpscale />,
    transformation: "e-upscale",
  },
  {
    label: "BG Remove",
    value: "bgremove",
    icon: <ImageMinus />,
    transformation: "e-bgremove",
  },
];

function ImageSettingSection({ selectedEl }: Props) {
  const [altText, setAltText] = useState(selectedEl.alt || "");
  const [width, setWidth] = useState<number>(selectedEl.width || 300);
  const [height, setHeight] = useState<number>(selectedEl.height || 200);
  const [borderRadius, setBorderRadius] = useState(
    selectedEl.style.borderRadius || "0px"
  );
  const [preview, setPreview] = useState(selectedEl.src || "");
  const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Use object URL instead of base64 to avoid large strings
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Cleanup old object URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const saveUploadedFile = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("fileName", `${Date.now()}.png`);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);

      // Call your API route to upload (you'll need to create this)
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.url + "?tr=";
      
      selectedEl.setAttribute("src", imageUrl);
      setPreview(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GenerateAiImage = () => {
    if (!altText.trim()) {
      alert("Please enter a prompt first");
      return;
    }
    
    setLoading(true);
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    const url = `${urlEndpoint}/ik-genimg-prompt-${encodeURIComponent(altText)}/${Date.now()}.png?tr=`;

    setPreview(url);
    selectedEl.setAttribute("src", url);
  };

  const ApplyTransformation = (trValue: string) => {
    setLoading(true);
    if (!preview.includes(trValue)) {
      const url = preview + trValue + ",";
      setPreview(url);
      selectedEl.setAttribute("src", url);
    } else {
      const url = preview.replace(trValue + ",", "");
      setPreview(url);
      selectedEl.setAttribute("src", url);
    }
  };

  return (
    <div className="w-96 shadow p-4 space-y-4">
      <h2 className="flex gap-2 items-center font-bold">
        <ImageIcon /> Image Settings
      </h2>

      {/* Preview (clickable) */}
      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
          onClick={openFileDialog}
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={saveUploadedFile}
        disabled={loading || !selectedImage}
      >
        {loading && <Loader2Icon className="animate-spin mr-2" />} Upload
        Image
      </Button>

      {/* Alt text */}
      <div>
        <label className="text-sm">Prompt</label>
        <Input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Enter prompt for AI image"
          className="mt-1"
        />
      </div>

      <Button className="w-full" onClick={GenerateAiImage} disabled={loading}>
        {loading && <Loader2Icon className="animate-spin mr-2" />}
        Generate AI Image
      </Button>

      {/* Transform Buttons */}
      <div>
        <label className="text-sm mb-1 block">AI Transform</label>
        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            {transformOptions.map((opt) => {
              const applied = preview.includes(opt.transformation);
              return (
                <Tooltip key={opt.value}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={applied ? "default" : "outline"}
                      className="flex items-center justify-center p-2"
                      onClick={() => ApplyTransformation(opt.transformation)}
                      disabled={loading}
                    >
                      {opt.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {opt.label} {applied && "(Applied)"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Conditional Resize Inputs */}
      {activeTransforms.includes("resize") && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm">Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm">Height</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Border Radius */}
      <div>
        <label className="text-sm">Border Radius</label>
        <Input
          type="text"
          value={borderRadius}
          onChange={(e) => setBorderRadius(e.target.value)}
          placeholder="e.g. 8px or 50%"
          className="mt-1"
        />
      </div>
    </div>
  );
}

export default ImageSettingSection;