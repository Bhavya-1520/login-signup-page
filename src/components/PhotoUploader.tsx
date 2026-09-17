"use client";

import { useRef, useState } from "react";

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
  label?: string;
}

// Downscale + compress an image file to a base64 data URL so it fits in
// cart state / Firestore documents (which have a ~1MB per-field limit).
function compressImage(file: File, maxDim = 900, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploader({ photos, onChange, max = 5, label }: PhotoUploaderProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const remaining = max - photos.length;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const slots = max - photos.length;
    if (slots <= 0) {
      alert(`You can upload up to ${max} photos only.`);
      return;
    }
    const selected = Array.from(files).slice(0, slots);
    setProcessing(true);
    try {
      const compressed = await Promise.all(
        selected.map((f) => compressImage(f).catch(() => null))
      );
      const valid = compressed.filter((c): c is string => !!c);
      onChange([...photos, ...valid]);
    } finally {
      setProcessing(false);
      if (cameraRef.current) cameraRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    }
  };

  const removePhoto = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#3D2B1F] mb-2">{label}</label>
      )}

      {/* Hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={remaining <= 0 || processing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {/* Camera icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          Camera
        </button>

        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={remaining <= 0 || processing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#89C4E1] text-[#5EAED4] text-sm font-medium hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {/* Upload / gallery icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Upload Photos
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {processing
          ? "Processing photos..."
          : `${photos.length} / ${max} photos added${remaining > 0 ? ` · ${remaining} left` : " · limit reached"}`}
      </p>

      {/* Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
          {photos.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
              <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
