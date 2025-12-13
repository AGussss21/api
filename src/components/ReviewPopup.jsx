import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewPopup({ open, onClose, onSubmit, productId, token }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHover(0);
      setComment("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Message, Rating, dan Product ID wajib diisi");
      return;
    }
    if (!token) {
      alert("Silahkan login terlebih dahulu.");
      return;
    }

    try {
      await onSubmit({ rating, comment, token }); // panggil handler dari parent
      setRating(0);
      setHover(0);
      setComment("");
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message || "Gagal mengirim review");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]"
        >
          <motion.div
            key="popup-card"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative flex flex-col items-center"
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </motion.button>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Leave your rate</h2>
            <p className="text-sm text-gray-500 mb-4">Give us a quick rating by clicking the stars</p>

            <div className="flex gap-2 mb-4 text-2xl">
              {[1,2,3,4,5].map(num => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHover(num)}
                  onMouseLeave={() => setHover(null)}
                  className={`cursor-pointer font-semibold ${num <= (hover || rating) ? "text-amber-500" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your review here"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring focus:ring-[#f08b2d] focus:outline-none"
            />

            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 w-full bg-[#f08b2d] text-white py-3 rounded-lg font-semibold hover:brightness-110 transition"
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
