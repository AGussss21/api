import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Popup from "../../components/Popup";
import ToastBanner from "../../components/ToastBanner";
import { products } from "../../data.js";
import { Minus, Plus, Trash } from "lucide-react";
import pickUp from "../../assets/Checkout/pick-up.png";
import delivery from "../../assets/Checkout/delivery.png";
import choose from "../../assets/Checkout/choose.png";

const CART_KEY = "user_cart";
const CHECKOUT_KEY = "user_checkout";

const methods = [
  { key: "pickup", label: "Pick Up", img: pickUp, imgClass: "w-16 h-16",},
  { key: "delivery", label: "Delivery", img: delivery, imgClass: "w-20 h-20",},
];

const fmtRp = (n = 0) => `Rp${(n || 0).toLocaleString("id-ID")}`;

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-changed"));
}

function findProductMeta(id) {
  if (!Array.isArray(products)) return null;
  return products.find((p) => p.id === id || String(p.id) === String(id)) || null;
}

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({}); // keys by _key
  const [note, setNote] = useState("");
  const [toast, setToast] = useState({ open: false, message: "" });
  const [popup, setPopup] = useState({ open: false });
  const [method, setMethod] = useState(null)

  const showPopup  = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  useEffect(() => {
    const raw = readCart();
    const hydrated = raw
      .map((it) => {
        if (!it || !it.id) return null;
        const meta = findProductMeta(it.id);
        if (!meta) return null; // skip unknown product ids
        return {
          _key: `${meta.id}__${it.size || ""}__${it.motif || ""}`,
          id: meta.id,
          name: meta.nama || meta.name || meta.title || "Produk Lola Cake",
          img: meta.img || meta.image || "/assets/bolu-keju.png",
          price: meta.price ?? 0,
          stock: meta.stock ?? 999,
          size: it.size || "",
          motif: it.motif || "",
          qty: Math.max(1, it.qty || 1),
        };
      })
      .filter(Boolean);
    setItems(hydrated);

    const sel = {};
    hydrated.forEach((i) => (sel[i._key] = true));
    setSelected(sel);
  }, []);

  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => !!selected[i._key]),
    [items, selected]
  );

  const toggleAll = (checked) => {
    const obj = {};
    if (checked) items.forEach((i) => (obj[i._key] = true));
    setSelected(obj);
  };

  const toggleOne = (key, checked) => {
    setSelected((s) => ({ ...s, [key]: checked }));
  };

  const removeChecked = () => {
    const remaining = items.filter((i) => !selected[i._key]);
    setItems(remaining);

    const persisted = remaining.map((it) => ({
      id: it.id,
      qty: it.qty,
      size: it.size || undefined,
      motif: it.motif || undefined,
    }));
    writeCart(persisted);
    setSelected({});
    setToast({ open: true, message: "Item terpilih telah dihapus.", type: "success" });
  };

  const removeItem = (itemKey) => {
    if (!itemKey) return;
    const exists = items.some((i) => i._key === itemKey);
    if (!exists) return;
    const remaining = items.filter((i) => i._key !== itemKey);

    setItemsAndPersist(remaining);
    setSelected((s) => {
      const copy = { ...s };
      delete copy[itemKey];
      return copy;
    });

    setToast({ open: true, message: "Item terpilih telah dihapus.", type: "success" });
  };

  const setItemsAndPersist = (newItems) => {
    setItems(newItems);
    const persisted = newItems.map((it) => ({
      id: it.id,
      qty: it.qty,
      size: it.size || undefined,
      motif: it.motif || undefined,
    }));
    writeCart(persisted);
  };

  const updateQty = (itemKey, delta) => {
    const found = items.find((i) => i._key === itemKey);
    if (!found) return;
    if (delta < 0 && found.qty === 1) {
      setToast({ open: true, message: "Minimal pembelian adalah 1.", type: "warning" });
      return;
    }
    let newQty = found.qty + delta;
    if (found.stock != null && newQty > found.stock) {
      newQty = found.stock;
      if (found.qty === found.stock) {
        setToast({ open: true, message: "Jumlah melebihi stok tersedia.", type: "error" });
        return;
      }
    }
    if (newQty === found.qty) return;
    const updated = items.map((i) =>
      i._key === itemKey ? { ...i, qty: newQty } : i
    );

    setItemsAndPersist(updated);
    setToast({ open: true, message: "Kuantitas diperbarui.", type: "success" });
  };

  const setQtyDirect = (itemKey, value) => {
    const found = items.find((i) => i._key === itemKey);
    if (!found) return;
    let num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 1) num = 1;
    if (found.stock != null && num > found.stock) num = found.stock;
    const updated = items.map((i) => (i._key === itemKey ? { ...i, qty: num } : i));
    setItemsAndPersist(updated);
  };

  const total = useMemo(() => {
    return items.reduce((sum, i) => (selected[i._key] ? sum + (i.price || 0) * (i.qty || 1) : sum), 0);
  }, [items, selected]);

  const buyNow = () => {
    const chosen = items.filter((i) => selected[i._key]);
    if (chosen.length === 0) {
      return showPopup({
        type: "error",
        message: "Pilih minimal satu produk terlebih dahulu.",
        okText: "OK",
        onOk: closePopup,
      });
    }

    if (!method) {
      setToast({ open: true, message: "Pilih metode pengiriman terlebih dahulu.", type: "warning" });
      return;
    }

    const payload = {
      items: chosen,
      note,
      total,
      method, // pickup | delivery
      createdAt: new Date().toISOString(),
    };

    console.log("Saving user_checkout:", payload);
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
    window.location.href = "/checkout/order-info";
  };

  useEffect(() => {
    const onCartChanged = () => {
      const stored = sessionStorage.getItem(CHECKOUT_KEY);
      if (stored) {
        console.log("Cart changed — clearing saved checkout");
        sessionStorage.removeItem(CHECKOUT_KEY);
      }
    };
    window.addEventListener("cart-changed", onCartChanged);
    return () => window.removeEventListener("cart-changed", onCartChanged);
  }, []);

  // motion variants
  const listItemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.995 },
  };

  const totalVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-orange-100 text-[#3d231d]">
          1. Cart
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          2. Order Info
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          3. Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-8">
          <div className="font-semibold mb-2">Your Cart</div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
                className="w-4 h-4 accent-[#f08b2d]"
              />
              <span className="select-none">Pilih Semua</span>
            </label>

            <button
              className="text-red-600 text-sm hover:underline"
              onClick={removeChecked}
            >
              Hapus
            </button>
          </div>

          <AnimatePresence initial={false}>
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 py-10 text-center rounded-lg border border-dashed border-gray-200"
              >
                Keranjang kosong. Ayo belanja dulu 😊
              </motion.div>
            ) : (
              items.map((it) => (
                <motion.div
                  key={it._key}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={listItemVariants}
                  transition={{ duration: 0.18 }}
                  className="border border-gray-200 rounded-xl py-3 px-4 mb-3 shadow-sm bg-white"
                >
                  <div className="w-full grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 items-center md:grid-cols-[auto_1fr_auto_auto_auto_auto]">
                    <div className="flex items-center justify-start">
                      <input type="checkbox" className="w-4 h-4 accent-[#f08b2d]"
                        checked={!!selected[it._key]} onChange={(e) => toggleOne(it._key, e.target.checked)}
                      />
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={it.img} alt={it.name} className="w-20 h-20 flex-shrink-0 object-contain rounded-md"/>
                      <div className="flex flex-col min-w-0">
                        <div className="font-semibold text-sm truncate">{it.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Stock: <span className="font-semibold">{it.stock ?? "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 text-center min-w-[90px]">
                      <span className="font-medium">{fmtRp(it.price)}</span>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit h-8 shadow-xs">
                      <button
                        onClick={() => updateQty(it._key, -1)}
                        className="px-2 flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input type="number" value={it.qty} min={1} max={it.stock ?? 999}
                        onChange={(e) => setQtyDirect(it._key, e.target.value)}
                        className="w-12 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-sm"
                      />
                      <button
                        onClick={() => updateQty(it._key, +1)}
                        className="px-2 flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <motion.div
                      key={`${it._key}-subtotal-${it.qty}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="font-semibold text-right min-w-[100px]"
                    >
                      {fmtRp((it.price || 0) * (it.qty || 1))}
                    </motion.div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => removeItem(it._key)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove item"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4">
          <motion.div layout className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
            <div className="font-semibold mb-2">Ringkasan Belanja</div>
            <div className="flex justify-between items-center">
              <div className="text-gray-500">Total</div>
              <motion.div
                key={`total-${total}`}
                initial="initial"
                animate="animate"
                variants={totalVariants}
                transition={{ duration: 0.18 }}
                className="font-bold text-lg"
              >
                {fmtRp(total)}
              </motion.div>
            </div>

            {/* Note input */}
            <div className="mt-4">
              <label className="text-sm text-gray-500 block mb-1">
                Add Order Note (Optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-[#f08b2d] outline-none text-sm"
              />
            </div>

            {/* Pilihan metode pengiriman */}
            <div className="mt-4 w-full flex gap-3">
              {methods.map((m) => (
                <button key={m.key} onClick={() => setMethod(m.key)} title={m.label}
                  className={`relative flex-1 border border-gray-300 rounded-lg p-2 
                    flex items-center justify-center gap-2 bg-[#F8F7F0]
                    hover:bg-orange-200 transition
                    ${method === m.key ? "ring-2 ring-orange-300 bg-orange-200 shadow-xl" : ""}
                  `}
                >
                  {method === m.key && (
                    <img src={choose} alt="selected" className="w-6 h-6 absolute -top-3 -right-3"/>
                  )}
                  <img src={m.img} alt={m.key} className={`${m.imgClass} object-contain`}/>
                </button>
              ))}
            </div>
            <button onClick={buyNow} className="w-full mt-4 py-2 rounded-lg text-white font-semibold bg-brand hover:brightness-95 transition">
              Buy now
            </button>
          </motion.div>
        </div>
      </div>

      <ToastBanner
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ open: false, message: "", type: "info" })}
      />
      <Popup {...popup} />
    </div>
  );
}
