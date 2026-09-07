"use client";

import { useEffect, useState, useRef } from "react";
import { searchByImage } from "@/lib/imageSearch";
import { products as allProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

interface ImageSearchPageProps {
  onNavigate: (page: string) => void;
}

export default function ImageSearchPage({ onNavigate }: ImageSearchPageProps) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [detectedGroup, setDetectedGroup] = useState<string | null>(null);
  const [error, setError] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem("imageSearchData");
      if (data) {
        setImageData(data);
      } else {
        setError("No image found. Please try again.");
        setResults(allProducts);
        setLoading(false);
      }
    } catch {
      setError("Could not load image.");
      setResults(allProducts);
      setLoading(false);
    }
  }, []);

  // Backup: if the image is set but onLoad didn't trigger search within 2s, run it
  useEffect(() => {
    if (!imageData) return;
    const t = setTimeout(() => {
      if (loading && imgRef.current?.complete) {
        runSearch();
      }
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  const runSearch = async () => {
    if (!imgRef.current) return;
    // Safety: if AI takes too long, show all products anyway
    const safety = setTimeout(() => {
      setLoading(false);
      setResults((prev) => (prev.length === 0 ? allProducts : prev));
    }, 16000);

    try {
      const result = await searchByImage(imgRef.current);
      setDetectedGroup(result.group);
      if (result.matchedProducts.length > 0) {
        setResults(result.matchedProducts);
      } else {
        setResults(allProducts);
      }
    } catch (err) {
      console.error("Image search error:", err);
      setError("Showing our full collection — tap any product to explore.");
      setResults(allProducts);
    } finally {
      clearTimeout(safety);
      setLoading(false);
    }
  };

  const groupLabel = (g: string | null) => {
    const map: Record<string, string> = {
      Bouquets: "Bouquets", Rakhi: "Rakhi Gifts", Resin: "Resin Arts", Birthday: "Birthday Gifts",
    };
    return g ? map[g] || g : "similar products";
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1810] mb-4">
        Search by Image
      </h1>

      {/* Uploaded image preview */}
      {imageData && (
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white shadow-md border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageData}
              alt="Your search"
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
              onLoad={runSearch}
            />
          </div>
          {loading && (
            <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
              <div className="animate-spin w-5 h-5 border-2 border-[#89C4E1] border-t-transparent rounded-full"></div>
              Analyzing your image with AI...
            </div>
          )}
          {!loading && detectedGroup && (
            <p className="text-sm text-[#5EAED4] font-medium mt-4">
              ✨ Showing {groupLabel(detectedGroup)} that match your image
            </p>
          )}
          {!loading && !detectedGroup && (
            <p className="text-sm text-gray-500 mt-4">
              We couldn&apos;t find an exact match — here&apos;s our full collection
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-center text-gray-400 text-sm mb-4">{error}</p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3">
          {results.map((product) => (
            <div key={product.id} className="break-inside-avoid mb-3">
              <ProductCard product={product} onNavigate={onNavigate} />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate("products")}
            className="px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full text-sm"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
}
