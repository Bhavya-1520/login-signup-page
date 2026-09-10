"use client";

import { useState, useEffect, useRef } from "react";
import { products as fallbackProducts } from "@/lib/products";
import { getProducts } from "@/lib/productsDB";
import { searchProducts } from "@/lib/recommendations";

interface SearchBarProps {
  onNavigate: (page: string) => void;
  compact?: boolean;
}

export default function SearchBar({ onNavigate, compact }: SearchBarProps) {
  const [products, setProducts] = useState<any[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProducts().then((dbProducts) => {
      if (dbProducts.length > 0) setProducts(dbProducts);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = query ? searchProducts(products, query) : [];

  const handleSelect = (productId: string) => {
    setShowSuggestions(false);
    setQuery("");
    onNavigate(`product-${productId}`);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      onNavigate(`search-${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      setQuery(transcript);
      // Navigate to full results for the spoken query
      onNavigate(`search-${encodeURIComponent(transcript.trim())}`);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleImagePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowImageMenu(false);
    const file = e.target.files?.[0];
    if (!file) return;
    // Store the image in sessionStorage and navigate to the image-search page
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem("imageSearchData", reader.result as string);
      } catch {}
      onNavigate("image-search");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "max-w-xl w-full"}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Search by Keyword or Product ID"
          className="w-full pl-9 pr-16 py-2.5 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#89C4E1] focus:border-transparent outline-none text-sm text-gray-900"
        />
        {/* Mic + Camera icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2.5 text-gray-400">
          {query ? (
            <button onClick={() => { setQuery(""); setShowSuggestions(false); }} className="hover:text-gray-600 text-sm">✕</button>
          ) : (
            <>
              <button onClick={handleVoiceSearch} className={listening ? "text-red-500 animate-pulse" : "hover:text-[#5EAED4]"} title="Voice search">
                <svg className="w-4 h-4" fill={listening ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>
              <span className="w-px h-4 bg-gray-200"></span>
              <button onClick={() => setShowImageMenu(true)} className="hover:text-[#5EAED4]" title="Search by image">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {showSuggestions && query && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-50 overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C1810] truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <span className="text-sm font-bold text-[#5EAED4]">₹{product.basePrice}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              No products found
            </div>
          )}
          {results.length > 0 && (
            <button
              onClick={handleSearch}
              className="w-full text-center px-4 py-2.5 text-sm text-[#5EAED4] font-medium hover:bg-sky-50 border-t border-gray-100"
            >
              See all results for &quot;{query}&quot; →
            </button>
          )}
        </div>
      )}

      {/* Hidden inputs for camera + gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImagePicked}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleImagePicked}
        className="hidden"
      />

      {/* Image search choice menu */}
      {showImageMenu && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[60]" onClick={() => setShowImageMenu(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full sm:max-w-xs" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-center font-semibold text-[#2C1810] mb-4">Search by Image</h3>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-sky-50 text-left"
            >
              <span className="text-2xl">📷</span>
              <div>
                <p className="text-sm font-medium text-[#2C1810]">Take a Photo</p>
                <p className="text-xs text-gray-400">Use your camera</p>
              </div>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-sky-50 text-left"
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <p className="text-sm font-medium text-[#2C1810]">Upload from Gallery</p>
                <p className="text-xs text-gray-400">Choose from your photos</p>
              </div>
            </button>
            <button
              onClick={() => setShowImageMenu(false)}
              className="w-full mt-2 py-2.5 text-sm text-gray-500 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
