// ? Estimasi Biaya Antar
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";

const fmtRp = (n = 0) => `Rp${(n || 0).toLocaleString("id-ID")}`;

function readCheckout() {
  try { return JSON.parse(sessionStorage.getItem("user_checkout")); }
  catch { return null; }
}
function readUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}

export default function OrderInfo() {
  const nav = useNavigate();

  // Read once for prefill
  const checkout = useMemo(() => readCheckout(), []);
  const user = useMemo(() => readUser(), []);

  // form state
  const [name, setName] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pickupDay, setPickupDay] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [postalCode, setPostalCode] = useState(""); // for delivery estimator
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [payMethod, setPayMethod] = useState("pay_now"); // pay_now | cod

  // fees
  const PACKING_FEE = 5000;
  const [deliveryFee, setDeliveryFee] = useState(null); // null = belum dihitung
  const [estimating, setEstimating] = useState(false);

  // popup state
  const [popup, setPopup] = useState({ open: false });
  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const store = {
    addr: "Toko Lola Cake - Jl. Sapati No.19, Kota Kendari",
    hoursText: "Senin - Sabtu (08.00 - 17.00 WIB)",
    openStart: "08:00",
    openEnd: "17:00",
    // OPTIONAL: storePostalPrefix used by estimator fallback — ganti sesuai area toko
    postalPrefix: "931", // *** ganti sesuai kode pos toko jika tersedia ***
  };

  const allowedDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // helper cek waktu
  const isTimeWithin = (timeStr, start = store.openStart, end = store.openEnd) => {
    if (!timeStr) return false;
    const [hStr, mStr] = timeStr.split(":");
    if (hStr == null || mStr == null) return false;
    const minutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
    const [sh, sm] = start.split(":").map((s) => parseInt(s, 10));
    const [eh, em] = end.split(":").map((s) => parseInt(s, 10));
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return minutes >= startMin && minutes <= endMin;
  };

  // subtotal from checkout
  const subtotal = useMemo(() => {
    if (!checkout?.items) return 0;
    return checkout.items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  }, [checkout]);

  // total calculation: subtotal + packing + (deliveryFee if delivery)
  const method = checkout?.method || "pickup";
  const total = useMemo(() => {
    const base = subtotal + PACKING_FEE;
    if (method === "delivery") {
      return base + (Number.isFinite(deliveryFee) ? deliveryFee : 0);
    }
    return base; // pickup: no delivery fee
  }, [subtotal, deliveryFee, method]);

  // ---------- Delivery fee estimator (client-side fallback) ----------
  // Approach: simple tiered estimator using postal code prefix.
  // - If postalCode startsWith store.postalPrefix => "local" (Rp15k)
  // - If postalCode length >=3 and first 3 digits differ => "nearby" (Rp25k)
  // - Otherwise fallback flat (Rp35k)
  // NOTE: this is only an estimate. Final ongkir should be calculated by server/courier API.
  const estimateDeliveryFee = () => {
    if (method !== "delivery") return;
    if (!postalCode || postalCode.trim().length < 3) {
      showPopup({
        type: "error",
        message: "Masukkan kode pos untuk estimasi ongkir (minimal 3 digit).",
        okText: "OK",
        onOk: closePopup,
      });
      return;
    }

    setEstimating(true);
    // small fake delay so UX feels like "calculation"
    setTimeout(() => {
      const code = postalCode.trim();
      const prefix3 = code.slice(0, 3);
      let fee = 35000; // default
      try {
        if (store.postalPrefix && code.startsWith(store.postalPrefix)) {
          fee = 15000; // local
        } else if (prefix3 === store.postalPrefix?.slice?.(0, 3)) {
          fee = 20000; // same region (if prefix partially matches)
        } else {
          // further heuristics: shorter diff -> less
          fee = 25000;
        }
      } catch (e) {
        fee = 25000;
      }

      setDeliveryFee(fee);
      setEstimating(false);
    }, 600);
  };

  // If user edits address or postal code, deliveryFee should be invalidated
  useEffect(() => {
    setDeliveryFee(null);
  }, [address, postalCode, method]);

  // ---------- Checkout validation on mount (same logic you used earlier) ----------
  useEffect(() => {
    const current = readCheckout();
    const isValidCheckout = (c) => {
      if (!c) return false;
      if (!Array.isArray(c.items) || c.items.length === 0) return false;
      if (!c.method) return false;
      if (c.createdAt) {
        const created = Date.parse(c.createdAt);
        if (Number.isNaN(created)) return false;
        const ageMin = (Date.now() - created) / 60000;
        if (ageMin > 30) return false;
      }
      return true;
    };

    if (!isValidCheckout(current)) {
      sessionStorage.removeItem("user_checkout");
      setPopup({
        open: true,
        type: "error",
        message:
          !current
            ? "Tidak ada data checkout. Silakan pilih produk di Keranjang terlebih dahulu."
            : !current.items || current.items.length === 0
              ? "Keranjang kosong. Silakan tambahkan produk terlebih dahulu."
              : !current.method
                ? "Metode pengiriman tidak ditemukan. Silakan pilih Pick Up / Delivery di halaman Keranjang."
                : "Data checkout sudah kadaluarsa. Silakan ulang proses checkout di Keranjang.",
        okText: "Kembali ke Keranjang",
        onOk: () => {
          closePopup();
          setTimeout(() => nav("/keranjang", { replace: true }), 40);
        },
      });
    }
  }, [nav]);

  // ---------- Save order handler ----------
  const saveOrder = () => {
    // basic identity validation
    if (!name.trim() || !phone.trim() || !email.trim()) {
      return showPopup({
        type: "error",
        message: "Lengkapi identitas penerima: nama, telepon, dan email.",
        okText: "OK",
        onOk: closePopup,
      });
    }

    if (method === "pickup") {
      if (!pickupDay || !pickupTime) {
        return showPopup({
          type: "error",
          message: "Silakan pilih hari dan jam pengambilan untuk Pick Up.",
          okText: "OK",
          onOk: closePopup,
        });
      }
      if (!allowedDays.includes(pickupDay)) {
        return showPopup({
          type: "error",
          message: `Toko buka ${store.hoursText}. Silakan pilih hari Senin sampai Sabtu.`,
          okText: "OK",
          onOk: closePopup,
        });
      }
      if (!isTimeWithin(pickupTime)) {
        return showPopup({
          type: "error",
          message: `Jam pengambilan harus antara ${store.openStart} dan ${store.openEnd}.`,
          okText: "OK",
          onOk: closePopup,
        });
      }
    } else {
      // delivery validations: address mandatory; ongkir can be estimated but not mandatory
      if (!address.trim()) {
        return showPopup({
          type: "error",
          message: "Silakan isi alamat pengantaran untuk Delivery.",
          okText: "OK",
          onOk: closePopup,
        });
      }
      if (deliveryTime && !isTimeWithin(deliveryTime)) {
        return showPopup({
          type: "error",
          message: `Jam pengantaran harus antara ${store.openStart} dan ${store.openEnd}.`,
          okText: "OK",
          onOk: closePopup,
        });
      }
      // optional: if deliveryFee is null, warn user it's estimated later
      if (deliveryFee === null) {
        showPopup({
          type: "warning",
          message:
            "Ongkir belum dihitung. Sistem akan menghitung ongkir final di langkah pembayaran. Lanjutkan?",
          okText: "Lanjut",
          cancelText: "Batal",
          onOk: () => {
            closePopup();
            finalizeOrder();
          },
          onCancel: () => closePopup(),
        });
        return;
      }
    }

    // if everything OK for pickup or delivery-with-fee -> finalize
    finalizeOrder();
  };

  const finalizeOrder = () => {
    const receiver = { name: name.trim(), phone: phone.trim(), email: email.trim() };
    const order = {
      mode: method,
      receiver,
      store,
      payment: { method: payMethod },
      checkout,
      subtotal,
      packingFee: PACKING_FEE,
      deliveryFee: method === "delivery" ? (Number.isFinite(deliveryFee) ? deliveryFee : null) : 0,
      total,
      note: checkout?.note || "",
      pickup: method === "pickup" ? { day: pickupDay, time: pickupTime } : null,
      delivery: method === "delivery" ? { address: address.trim(), postalCode: postalCode.trim() || null, time: deliveryTime || null, note: deliveryNote || "" } : null,
      createdAt: new Date().toISOString(),
    };

    // Save order draft and continue
    sessionStorage.setItem("user_order", JSON.stringify(order));
    if (payMethod === "pay_now") nav("/checkout/payment");
    else nav("/checkout/payment-cod");
  };

  // ------------------ RENDER ------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Steps */}
      <div className="flex items-center mb-6">
        <div className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-[#3d231d] opacity-50">1. Cart</div>
        <div className="flex-1 h-1 bg-gray-100 mx-3" />
        <div className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-[#3d231d]">2. Order Info</div>
        <div className="flex-1 h-1 bg-gray-100 mx-3" />
        <div className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-[#3d231d] opacity-50">3. Payment</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Informasi Penerima</h3>

            {!checkout && <div className="text-sm text-gray-500 mb-3">Memeriksa data checkout... jika tidak ada, kamu akan diarahkan kembali ke Keranjang.</div>}

            <label className="block text-xs text-gray-500 mb-1">Nama Penerima</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama penerima" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />

            <label className="block text-xs text-gray-500 mb-1">Nomor Telepon</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />

            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200" />

            {method === "pickup" && (
              <>
                <h4 className="text-sm font-medium mb-2">Pick Up</h4>

                <label className="block text-xs text-gray-500 mb-1">Hari Pengambilan</label>
                <select value={pickupDay} onChange={(e) => setPickupDay(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md mb-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="" disabled>Pilih hari...</option>
                  {allowedDays.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <label className="block text-xs text-gray-500 mb-1">Jam Pengambilan</label>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} min={store.openStart} max={store.openEnd} className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200" />

                <div className="text-xs text-gray-500 mb-3">Jam operasional: {store.hoursText}</div>
              </>
            )}

            {method === "delivery" && (
              <>
                <h4 className="text-sm font-medium mb-2">Delivery</h4>

                <label className="block text-xs text-gray-500 mb-1">Alamat Pengantaran</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4} placeholder="Masukkan alamat lengkap (nama jalan, nomor, kecamatan, kota)" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Kode Pos (untuk estimasi ongkir)</label>
                    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Contoh: 931xx" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={estimateDeliveryFee} disabled={estimating} className="w-full px-3 py-2 bg-[#f08b2d] text-white rounded-md hover:brightness-95">
                      {estimating ? "Menghitung..." : "Hitung Ongkir"}
                    </button>
                  </div>
                </div>

                <label className="block text-xs text-gray-500 mb-1">Jam Pengantaran (opsional)</label>
                <input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} min={store.openStart} max={store.openEnd} className="w-full px-3 py-2 border border-gray-200 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />

                <label className="block text-xs text-gray-500 mb-1">Catatan untuk kurir (opsional)</label>
                <input value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder="Contoh: parkir di halaman, antar ke resepsionis" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200" />

                <div className="text-xs text-gray-500 mb-3">Jam operasional: {store.hoursText}. Jika tidak memilih jam, pesanan akan dikirim secepatnya saat ada kurir.</div>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={saveOrder} className="flex-1 bg-[#f08b2d] text-white py-2 rounded-md font-semibold hover:brightness-95">Simpan & Lanjut</button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Informasi Toko</h3>
            <div className="text-sm text-gray-700">{store.addr}</div>
            <div className="text-sm text-gray-500 mt-2">Buka: {store.hoursText}</div>
            <div className="text-sm text-gray-500 mt-2">Pesanan diproses sesuai jam operasional. Ongkir yang tampil adalah estimasi (kecuali jika dihitung server).</div>
            <a className="inline-block mt-3 px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50" href="https://maps.google.com/?q=Jl. Sapati No.19, Kendari" target="_blank" rel="noreferrer">Lihat di Google Maps</a>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Ringkasan Pesanan</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><div>Subtotal</div><div>{fmtRp(subtotal)}</div></div>

              <div className="flex justify-between text-sm text-gray-600"><div>Biaya packing</div><div>{fmtRp(PACKING_FEE)}</div></div>

              {method === "delivery" && (
                <div className="flex justify-between text-sm text-gray-600">
                  <div>Biaya antar (estimasi)</div>
                  <div>
                    {deliveryFee === null ? <span className="text-xs text-gray-400">Belum dihitung</span> : <span>{fmtRp(deliveryFee)}</span>}
                  </div>
                </div>
              )}

              {/* if pickup, remove biaya antar row entirely */}

              <div className="flex justify-between text-sm font-semibold mt-2">
                <div>Total</div>
                <div>{fmtRp(total)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Metode Pembayaran</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-md cursor-pointer">
                <input type="radio" name="pay" checked={payMethod === "pay_now"} onChange={() => setPayMethod("pay_now")} className="w-4 h-4" />
                <div>
                  <div className="text-sm">Bayar Sekarang</div>
                  <div className="text-xs text-gray-500">Transfer / Kartu</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-md cursor-pointer">
                <input type="radio" name="pay" checked={payMethod === "cod"} onChange={() => setPayMethod("cod")} className="w-4 h-4" />
                <div>
                  <div className="text-sm">Bayar Nanti (Saat Ambil)</div>
                  <div className="text-xs text-gray-500">Hanya untuk Pick Up atau COD jika memungkinkan</div>
                </div>
              </label>
            </div>

            <div className="mt-4 text-right">
              <button onClick={saveOrder} className="px-4 py-2 bg-[#f08b2d] text-white rounded-md font-semibold hover:brightness-95">Lanjut ke Pembayaran</button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom total */}
      <div className="text-right mt-4 text-sm text-gray-500">Total: <span className="font-semibold text-gray-800">{fmtRp(total)}</span></div>

      <Popup {...popup} />
    </div>
  );
}
