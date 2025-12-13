import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Popup from "../../components/Popup";
import ToastBanner from "../../components/ToastBanner";
import ReviewPopup from "../../components/ReviewPopup";
import { slugify } from "../../lib/slugify";
// Asumsi productsData digunakan untuk simulasi data dasar produk
import { products } from "../../data.js"; 
import { Minus, Plus, MessageCircle, Share2, Clipboard, ShoppingCart } from "lucide-react";

// *** GANTI DENGAN URL BACKEND ANDA YANG SEBENARNYA ***
const API_BASE_URL = "http://localhost:5000/api"; 
// Asumsi: Testimonials endpoint di /api/testimonials

// Fungsi utilitas tetap
function getUser() {
  try {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !userData) return null;

    return {
      id: userData.id,     // WAJIB ADA
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar || null
    };
  } catch {
    return null;
  }
}



function formatDateFromISO(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(d);
  } catch {
    return iso || "";
  }
}

// =================================================================
// 🚀 FUNGSI API (Real Connection ke Backend)
// =================================================================

// 1. Mengambil detail produk dasar (menggunakan simulasi data lokal)
// *** Ganti dengan panggilan API GET /api/products/:slug jika Anda sudah membuatnya ***
async function fetchProductData(slug, type) {
    const ALL_PRODUCTS = products.flatMap(p => { // ganti productsData -> products
        const name = p.nama || p.name || p.title || "";
        return {
            id: p.id,
            name: name,
            title: p.title || p.name || p.nama || "",
            category: p.category || p.categoryName || "",
            price: p.price ?? 0,
            img: p.img || p.image || "",
            sold: p.sold ?? 0,
            stock: p.stock ?? null,
            description: p.desc || p.description || "",
        };
    });
    const [slugPart, idMaybe] = String(slug || "").split("--");
    let found = idMaybe 
        ? ALL_PRODUCTS.find((p) => String(p.id) === idMaybe) 
        : ALL_PRODUCTS.find((p) => slugify(p.name || p.title) === slugPart);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return found ? JSON.parse(JSON.stringify(found)) : null;
}


// 2. Mengambil review produk dari endpoint backend Testimonials
async function fetchReviewsForProduct(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials/product/slug/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const reviews = await response.json();

        return reviews.map(r => ({
            id: r.id,
            name: r.name, 
            avatar: r.avatar_url || "/assets/Profile/avatar-icon.png", 
            rating: r.rating,
            createdAt: r.created_at,
            text: r.message,
            date: formatDateFromISO(r.created_at),
        }));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}



// 3. Mengirim review baru ke endpoint backend Testimonials (POST)
async function postReview(productId, { rating, text, token }) {
    

    const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Wajib untuk verifikasi token
        },
        body: JSON.stringify({ 
            message: text,
            rating: rating,
            products_id: productId // Sesuai dengan field backend
        }),
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized. Silakan login kembali.');
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim review.');
    }

    const result = await response.json();
    return result.data; // Mengembalikan data review yang sudah disimpan
}


// =================================================================
// 💻 KOMPONEN REACT UTAMA
// =================================================================

export default function ProductDetail({ type = "satuan" }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("desc");
  const [qty, setQty] = useState(1);

  const [popup, setPopup] = useState({ open: false });
  const [toast, setToast] = useState({ open: false, message: "" });
  const [open, setOpen] = useState(false);
  const shareUrl = window.location.href;
  const dropdownRef = useRef(null);
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));
  const user = getUser();
  const isGuest = !user;

  // 🔄 Load product data and reviews
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const found = await fetchProductData(slug, type);

        if (!found) {
          if (alive) navigate(`/product/${type}`);
        } else {
            // Ambil Reviews dari endpoint Testimonials menggunakan product.id
            const fetchedReviews = await fetchReviewsForProduct(found.slug);

            if (alive) {
                const updatedProduct = { 
                    ...found, 
                    reviews: fetchedReviews 
                };
                setProduct(updatedProduct);
            }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (alive) {
            // Handle error fetching data gracefully
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug, type, navigate]);

  // ===== kalkulator rating (TIDAK BERUBAH) =====
  const ratingStats = useMemo(() => {
    if (!product) return { avg: 5, total: 0, counts: {5:0,4:0,3:0,2:0,1:0}, percents: {} };
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    (product.reviews || []).forEach((r) => {
      const val = Number(r.rating) || 0;
      if (val >= 1 && val <= 5) counts[val] = (counts[val] || 0) + 1;
      sum += val;
    });
    const total = (product.reviews || []).length;
    const avg = total ? +(sum / total).toFixed(1) : 5.0;
    const percents = {};
    for (let v = 5; v >= 1; v--) {
      percents[v] = total ? Math.round((counts[v] / total) * 100) : 0;
    }
    return { avg, total, counts, percents };
  }, [product]);

  const formatReviewsCount = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count;
  };

  const handleAddToCart = () => {
    if (isGuest) {
      return showPopup({
        type: "error",
        message: "Silahkan login terlebih dahulu",
        okText: "Kembali Halaman Login",
        onOk: () => {
          closePopup();
          window.location.href = "/login";
        },
      });
    }

    const key = "user_cart";
    const raw = localStorage.getItem(key);
    const cart = raw ? JSON.parse(raw) : [];
    const index = cart.findIndex((i) => i.id === product.id);
    if (index >= 0) cart[index].qty += qty;
    else
        cart.push({
            id: product.id,
            name: product.name || product.title,
            price: product.price,
            qty,
        });
    localStorage.setItem(key, JSON.stringify(cart));
    try { window.dispatchEvent(new Event("cart-changed")); } catch {}

    setToast({ open: true, message: "Produk berhasil ditambahkan ke keranjang Anda." });
  };

  const handleBuyNow = () => {
    if (isGuest) {
      return showPopup({
        type: "error",
        message: "Silahkan login terlebih dahulu",
        okText: "Kembali Halaman Login",
        onOk: () => {
          closePopup();
          window.location.href = "/login";
        },
      });
    }
    handleAddToCart(); 
    window.location.href = "/keranjang";
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenReview = () => {
    if (isGuest) {
      return showPopup({
        type: "error",
        message: "Silahkan login untuk memberikan review.",
        okText: "Login",
        onOk: () => {
          closePopup();
          window.location.href = "/login";
        },
      });
    }
    setReviewPopupOpen(true);
  };

  // 📝 Handle Submit Review (Mengirim ke Backend)
  const handleSubmitReview = async ({ rating, comment, }) => { 
    if (!product || !user?.id) { 
        setReviewPopupOpen(false);
        return;
    }

    try {
        const resultData = await postReview(product.id, { rating, text: comment, token: localStorage.getItem("token") }); 

        // Update state lokal dengan data yang dikembalikan backend
        const updatedReview = { 
            ...resultData, 
            date: formatDateFromISO(resultData.created_at), 
            text: resultData.message,
            avatar: user?.avatar || "/assets/user1.jpg", // Gunakan avatar user yang login
        };

        const updated = { ...product, reviews: [updatedReview, ...(product.reviews || [])] };
        setProduct(updated);

        setReviewPopupOpen(false);
        setToast({ open: true, message: "Terima kasih atas review Anda!" });

    } catch (error) {
        console.error("Error submitting review:", error);
        setReviewPopupOpen(false);
        showPopup({
            type: "error",
            message: error.message || "Gagal mengirim review. Silakan coba lagi.",
        });
    }
  };

  if (!product) return null;

  const productName = product.name || product.title;
  const reviews = product.reviews || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* left: image + ratings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="lg:col-span-4"
        >
          <img src={product.img} alt={productName} className="w-full rounded-lg mb-4 object-contain"/>
          <div className="hidden md:block bg-white p-4">
            <div className="text-sm font-bold text-gray-700 mb-1">Ratings & Reviews</div>
            <div className="flex gap-6 mt-3">
              <div className="w-1/3 flex flex-col items-center">
                <div className="text-3xl font-bold">{ratingStats.avg}</div>
                <div className="text-sm text-amber-500 font-bold tracking-widest">{"★".repeat(Math.round(ratingStats.avg))}</div>
                <div className="text-sm text-gray-500">({formatReviewsCount(ratingStats.total)})</div>
              </div>
              <div className="w-2/3 space-y-1">
                {[5,4,3,2,1].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="text-sm flex items-center gap-1">
                      <span className="text-amber-500 font-bold">★</span>
                      <span>{v}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded flex-1 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${ratingStats.percents[v] ?? 0}%` }}/>
                    </div>
                    <div className="text-sm text-gray-500 text-right">{ratingStats.counts[v] ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* center: details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="text-sm mb-2">
            <a href="/">Home</a> &gt; <a href="/product">Product</a> &gt; <a href={type === "satuan" ? "/product/satuan" : "/product/paketan"}>{type === "satuan" ? "Item Satuan" : "Paketan"}</a>
          </div>
          <h1 className="text-2xl font-extrabold text-[#3d231d] mb-2">{productName}</h1>
          <div className="flex items-center text-sm mt-1 mb-4 text-gray-600">
            <div className="flex items-center gap-1">
              <span>{ratingStats.avg}</span>
              <span className="text-amber-500 font-bold">★</span>
            </div>
            <div className="before:content-['•'] before:text-gray-300 before:mx-2">{formatReviewsCount(ratingStats.total)} Reviews</div>
            <div className="before:content-['•'] before:text-gray-300 before:mx-2">{product.sold} Sold</div>
          </div>

          {/* tabs */}
          <div className="flex items-end gap-4 mb-3">
            <button onClick={() => setActiveTab("desc")} className={`pb-2 font-semibold ${activeTab === "desc" ? "text-[#f08b2d] border-b-2 border-[#f08b2d]" : "text-gray-600"}`}>
              Description
            </button>
            <button onClick={() => setActiveTab("review")} className={`pb-2 font-semibold ${activeTab === "review" ? "text-[#f08b2d] border-b-2 border-[#f08b2d]" : "text-gray-600"}`}>
              Review
            </button>
          </div>

          {activeTab === "desc" ? (
            <motion.div
              key="desc-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</div>
            </motion.div>
          ) : (
            <motion.div
              key="review-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {reviews.length === 0 ? (
                <div className="text-gray-500 text-sm">Belum ada review untuk produk ini.</div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="flex gap-3 p-3 rounded-lg bg-white">
                      <img src={rev.avatar} alt={rev.name} className="w-12 h-12 rounded-full object-contain bg-gray-100"/>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-800">{rev.name}</div>
                          <div className="text-amber-400 tracking-widest">{"★".repeat(Number(rev.rating))}{"☆".repeat(5 - Number(rev.rating))}</div>
                        </div>
                        <div className="text-xs text-gray-500">{rev.date || (rev.createdAt ? formatDateFromISO(rev.createdAt) : "")}</div>
                        <div className="mt-1 text-sm text-gray-700">{rev.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <button onClick={handleOpenReview} className="inline-block px-3 py-2 border border-[#f08b2d] text-[#f08b2d] rounded-lg hover:bg-[#f08b2d] hover:text-white transition">
                  Leave review and rate
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* right: order box */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
          >
            <h6 className="font-semibold">Atur Pesanan</h6>
            <div className="flex items-center gap-3 mb-3">
              <img src={product.img} alt="" className="w-30 h-30 py-2 rounded object-contain" />
            </div>
            <div className="flex items-center mb-3">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit h-8 shadow-xs">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={isGuest} className="px-1 flex items-center justify-center" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <input type="number" value={qty} onBlur={() => {if (qty === "") setQty(1);}}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setQty("");
                      return;
                    }
                    let num = parseInt(val, 10);
                    if (!isNaN(num)) {
                      if (num < 1) num = 1;
                      if (product.stock !== null && num > product.stock) num = product.stock;
                      setQty(num);
                    }
                  }}
                  className="w-8 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button onClick={() => setQty((q) => q + 1)} disabled={isGuest || (product.stock !== null && qty >= product.stock)} className="px-1 flex items-center justify-center" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              {/* Stock info */}
              <div className="ml-auto text-sm">Stock: <strong>{product.stock ?? <Minus/>}</strong></div>
            </div>

            <div className="text-sm text-gray-500 mb-1">Total Price:</div>
            <div className="text-xl font-bold mb-3">Rp{(product.price * qty).toLocaleString("id-ID")}</div>
            <button onClick={handleBuyNow} className="w-full bg-[#f08b2d] text-white py-2 rounded-lg font-semibold mb-2 hover:brightness-95 transition">
              Buy now
            </button>
            <button onClick={handleAddToCart} className="w-full border border-green-600 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center">
              <ShoppingCart size={20} className="inline-block mr-2"/> Add to cart
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="flex justify-between text-sm mt-4"
          >
            <button className="flex items-center gap-1 cursor-pointer" onClick={() => window.open("https://wa.me/6285241931688", "_blank")}>
              <MessageCircle size={16} className="text-green-600"/> Chat Seller
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(!open)} className="flex items-center gap-1 cursor-pointer">
                <Share2 size={16} className="text-green-600"/> Share Product
              </button>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg p-2 text-sm z-10" 
                >
                  <div className="mb-2 font-semibold">Share this product</div>
                  <button onClick={copyLink} className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-1 cursor-pointer">
                    <Clipboard size={14} /> Copy Link
                  </button>
                  {/* Share media links... */}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ToastBanner open={toast.open} message={toast.message} onClose={() => setToast({ open: false, message: "" })} />
      <Popup {...popup} />

      <ReviewPopup
  open={reviewPopupOpen}
  onClose={() => setReviewPopupOpen(false)}
  onSubmit={handleSubmitReview}
  productId={product?.id}             // Tambah ini
  token={localStorage.getItem("token")} // Tambah ini
/>
    </motion.div>
  );
}