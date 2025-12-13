import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReviewPopup from "../../components/ReviewPopup"; 
import { Minus, Plus, ShoppingCart } from "lucide-react";

// *** GANTI DENGAN URL BACKEND ANDA ***
const API_BASE_URL = "http://localhost:5000/api"; 

// Fungsi format tanggal (ISO -> dd/mm/yyyy)
function formatDateFromISO(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// ======================
// API Functions
// ======================

// 1️⃣ Fetch reviews untuk produk
async function fetchReviewsForProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/product/${productId}`);
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

// 2️⃣ Post review baru
async function postReview(productId, { rating, text }) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: text,
      rating,
      products_id: productId,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized. Silakan login kembali.");
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Gagal mengirim review.");
  }

  const result = await response.json();
  return result.data;
}

// ======================
// Component
// ======================

export default function ProductDetail({ productsData = [], type = "satuan" }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch product & reviews on mount
  useEffect(() => {
    const found = productsData.find(p => p.slug === slug);
    if (!found) return;

    setProduct(found);
    setLoadingReviews(true);

    fetchReviewsForProduct(found.id)
      .then(reviews => {
        setProduct(prev => ({ ...prev, reviews }));
      })
      .finally(() => setLoadingReviews(false));
  }, [slug, productsData]);

  // Handle quantity
  const incrementQty = () => setQty(prev => prev + 1);
  const decrementQty = () => setQty(prev => (prev > 1 ? prev - 1 : 1));

  // Handle submit review
  const handleSubmitReview = async ({ rating, comment }) => {
    if (!product || !user?.id) {
      setReviewPopupOpen(false);
      return;
    }

    if (isSubmitting) return; // proteksi submit ganda
    setIsSubmitting(true);

    try {
      const resultData = await postReview(product.id, { rating, text: comment });

      const updatedReview = {
        ...resultData,
        date: formatDateFromISO(resultData.created_at),
        text: resultData.message,
        avatar: user?.avatar || "/assets/user1.jpg",
      };

      setProduct(prev => ({
        ...prev,
        reviews: [updatedReview, ...(prev.reviews || [])],
      }));

      setReviewPopupOpen(false);
      alert("Terima kasih atas review Anda!"); // bisa diganti Toast
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewPopupOpen(false);
      alert(error.message || "Gagal mengirim review. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return <div>Loading product...</div>;

  return (
    <motion.div className="product-detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <div className="quantity">
        <button onClick={decrementQty}><Minus /></button>
        <span>{qty}</span>
        <button onClick={incrementQty}><Plus /></button>
      </div>

      <button className="add-to-cart">
        <ShoppingCart /> Tambah ke Keranjang
      </button>

      <hr />

      <h2>Review ({product.reviews?.length || 0})</h2>
      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {product.reviews?.map(r => (
            <div key={r.id} className="review-item">
              <img src={r.avatar} alt={r.name} width={40} height={40} />
              <div>
                <strong>{r.name}</strong> - <small>{r.date}</small>
                <p>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setReviewPopupOpen(true)}>Tulis Review</button>

      <ReviewPopup
        open={reviewPopupOpen}
        onClose={() => setReviewPopupOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </motion.div>
  );
}
