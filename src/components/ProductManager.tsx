"use client";

import { useEffect, useState, useRef } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  ProductDB,
  CATEGORIES,
} from "@/lib/productsDB";

export default function ProductManager() {
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDB | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Downscale + compress an image so many photos fit in the Firestore document.
  const compressImage = (file: File, maxDim = 900, quality = 0.7): Promise<string> =>
    new Promise((resolve, reject) => {
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
          if (!ctx) { resolve(reader.result as string); return; }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Accepts MULTIPLE files and APPENDS them (so you can add photos one batch at a time)
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selected = Array.from(files);
    try {
      const compressed = await Promise.all(
        selected.map((f) => compressImage(f).catch(() => null))
      );
      const valid = compressed.filter((c): c is string => !!c);
      setForm((prev) => {
        const merged = [...prev.images, ...valid];
        return { ...prev, images: merged, image: prev.image || merged[0] || "" };
      });
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== idx);
      return { ...prev, images: next, image: next[0] || "" };
    });
  };

  const [form, setForm] = useState({
    name: "",
    category: "Gifts",
    description: "",
    basePrice: 0,
    image: "",
    images: [] as string[],
    customizable: true,
    pricePerExtra: 0,
    stock: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "Gifts",
      description: "",
      basePrice: 0,
      image: "",
      images: [],
      customizable: true,
      pricePerExtra: 0,
      stock: 0,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: ProductDB) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      basePrice: product.basePrice,
      image: product.image,
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      customizable: product.customizable,
      pricePerExtra: product.pricePerExtra || 0,
      stock: product.stock ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.basePrice) {
      alert("Please fill in name, description, and price");
      return;
    }
    if (Number(form.basePrice) <= 0) {
      alert("Base price must be greater than 0");
      return;
    }
    if (Number(form.pricePerExtra) < 0) {
      alert("Price per extra cannot be negative");
      return;
    }

    setSaving(true);

    const productData: Omit<ProductDB, "id"> = {
      name: form.name,
      category: form.category,
      description: form.description,
      basePrice: Number(form.basePrice),
      image: form.image || form.images[0] || "/images/placeholder.jpg",
      images: form.images,
      customizable: form.customizable,
      stock: Math.max(0, Number(form.stock)),
      ...(form.pricePerExtra > 0 && { pricePerExtra: Number(form.pricePerExtra) }),
    };

    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      await loadProducts();
      resetForm();
    } catch (err) {
      alert("Failed to save product. Please try again.");
      console.error(err);
    }

    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-8 h-8 border-4 border-[#E8A0BF] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-[#2C1810]">
          Products ({products.length})
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-5 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full hover:shadow-lg transition-all text-sm"
        >
          + Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="glass-card rounded-3xl p-6 mb-6">
          <h3 className="font-display text-lg font-semibold text-[#2C1810] mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Satin Rose Bouquet"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900 bg-white/80"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the product..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none resize-none text-gray-900 bg-white/80"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  min={0}
                  value={form.basePrice || ""}
                  onChange={(e) => setForm({ ...form, basePrice: Math.max(0, Number(e.target.value)) })}
                  placeholder="199"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Extra (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.pricePerExtra || ""}
                  onChange={(e) => setForm({ ...form, pricePerExtra: Math.max(0, Number(e.target.value)) })}
                  placeholder="100"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900 bg-white/80"
                />
              </div>
            </div>

            {/* Product Images (multiple) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Photos {form.images.length > 0 && <span className="text-gray-400">({form.images.length} added)</span>}
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Camera button */}
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#89C4E1] text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span className="text-[10px]">Camera</span>
                </button>
                {/* Upload button (multiple) */}
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#89C4E1] text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-[10px]">Upload</span>
                </button>
              </div>

              {/* Thumbnails */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                  {form.images.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] text-center py-0.5">Main</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-red-500"
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Add as many photos as you like — the first one is the main image. Tap Upload to pick several at once.</p>

              <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleImageFile} className="hidden" />
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleImageFile} className="hidden" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory / Stock (units available) *</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)) })}
                placeholder="e.g., 5"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8A0BF] focus:border-transparent outline-none text-gray-900 bg-white/80"
              />
              <p className="text-xs text-gray-400 mt-1">
                Customers cannot order more than this. Set to 0 to mark as out of stock.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.customizable}
                  onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
                  className="w-4 h-4 accent-[#E8A0BF]"
                />
                <span className="text-sm text-gray-700">Customizable (customer can choose colors/add-ons)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#89C4E1] to-[#F8C8DC] text-white font-medium rounded-full hover:shadow-lg transition-all text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-full hover:bg-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">📦</span>
          <p className="text-gray-500 mb-2">No products yet</p>
          <p className="text-gray-400 text-sm">Click "Add Product" to add your first product</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[#2C1810] truncate">{product.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs flex-shrink-0">
                    {product.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
              </div>

              {/* Price + stock */}
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-[#C77DA5] font-display block">₹{product.basePrice}</span>
                {product.stock !== undefined && (
                  <span className={`text-xs font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-amber-600" : "text-green-600"}`}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => product.id && handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === product.id ? "..." : "🗑️"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
