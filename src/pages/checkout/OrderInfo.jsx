import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";

const PACKING_FEE = 5000;
const STORE_PHONE_E164 = "+628123456789";
const STORE_GOOGLE_MAPS_Q = "Jl. Sapati No.19, Kendari";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

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

  // read once for prefill
  const checkout = useMemo(() => readCheckout(), []);
  const user = useMemo(() => readUser(), []);

  // top-level hooks (all declared)
  const [name, setName] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pickupDay, setPickupDay] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [payMethod, setPayMethod] = useState("pay_now"); // pay_now | cod

  const [popup, setPopup] = useState({ open: false });
  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const store = {
    addr: "Toko Lola Cake - Jl. Sapati No.19, Kota Kendari",
    hoursText: "Senin - Sabtu (08.00 - 17.00 WIB)",
    openStart: "08:00",
    openEnd: "17:00",
    mapsQuery: STORE_GOOGLE_MAPS_Q,
    phone: STORE_PHONE_E164,
  };

  const allowedDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // helper time-range check (HH:MM)
  const isTimeWithin = (timeStr, start = store.openStart, end = store.openEnd) => {
    if (!timeStr) return false;
    const [h, m] = timeStr.split(":").map((s) => parseInt(s, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return false;
    const minutes = h * 60 + m;
    const [sh, sm] = start.split(":").map((s) => parseInt(s, 10));
    const [eh, em] = end.split(":").map((s) => parseInt(s, 10));
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return minutes >= startMin && minutes <= endMin;
  };

  // subtotal from checkout
  const subtotal = useMemo(() => {
    if (!checkout?.items) return 0;
    return checkout.items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  }, [checkout]);

  const method = checkout?.method || "pickup";
  const total = subtotal + PACKING_FEE;

  useEffect(() => {
    const current = readCheckout();
    const isValidCheckout = (c) => {
      if (!c) return false;
      if (!Array.isArray(c.items) || c.items.length === 0) return false;
      if (!c.method) return false;
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
              : "Metode pengiriman tidak ditemukan. Silakan pilih Pick Up / Delivery di halaman Keranjang.",
        okText: "Kembali ke Keranjang",
        onOk: () => {
          closePopup();
          setTimeout(() => nav("/keranjang", { replace: true }), 40);
        },
      });
    }
  }, [nav]);

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
      total, // subtotal + packing
      note: checkout?.note || "",
      pickup: method === "pickup" ? { day: pickupDay, time: pickupTime } : null,
      delivery: method === "delivery" ? { address: address.trim(), note: deliveryNote || "" } : null,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("user_order", JSON.stringify(order));
    if (payMethod === "pay_now") nav("/checkout/payment");
    else nav("/checkout/payment-cod");
  };

  const saveOrder = () => {
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
      finalizeOrder();
    } else {
      if (!address.trim()) {
        return showPopup({
          type: "error",
          message: "Silakan isi alamat pengantaran untuk Delivery.",
          okText: "OK",
          onOk: closePopup,
        });
      }
      finalizeOrder();
    }
  };

  const getWhatsAppLink = () => {
    const phoneNormalized = store.phone.replace(/\D/g, "");
    const lines = [];
    lines.push("Halo, saya ingin konfirmasi pesanan dari Lola Cake.");
    if (checkout?.items) {
      checkout.items.forEach((it) => {
        lines.push(`- ${it.name} x${it.qty} (${fmtRp((it.price || 0))})`);
      });
    }
    lines.push(`Subtotal: ${fmtRp(subtotal)}`);
    lines.push(`Packing: ${fmtRp(PACKING_FEE)}`);
    lines.push(`Total (tanpa ongkir): ${fmtRp(total)}`);
    lines.push("");
    lines.push("Nama: " + (name || "-"));
    lines.push("Telepon: " + (phone || "-"));
    lines.push("Alamat: " + (address || "-"));
    lines.push("Catatan: " + (deliveryNote || "-"));
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${phoneNormalized}?text=${text}`;
  };

  const getMapsLink = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
  };

  const ItemList = () => {
    if (!checkout?.items || checkout.items.length === 0) return <div className="text-sm text-gray-500">Tidak ada item.</div>;
    return (
      <ul className="space-y-3">
        {checkout.items.map((it) => (
          <li key={it._key} className="flex items-center gap-3">
            <img src={it.img} alt={it.name} className="w-14 h-14 object-contain" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{it.name}</div>
              <div className="text-xs text-gray-500">Jumlah: {it.qty}</div>
            </div>
            <div className="text-sm font-semibold">{fmtRp((it.price || 0) * (it.qty || 1))}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          1. Cart
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-orange-100 text-[#3d231d]">
          2. Order Info
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          3. Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Informasi Penerima</h3>

            {!checkout && <div className="mb-4 text-sm text-gray-500">Memeriksa data checkout... jika tidak ada, kamu akan diarahkan kembali ke Keranjang.</div>}

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
                  {allowedDays.map((d) => (<option key={d} value={d}>{d}</option>))}
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

                <label className="block text-xs text-gray-500 mb-1">Catatan untuk kurir (opsional)</label>
                <input value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder="Contoh: parkir di halaman, antar ke resepsionis" className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200" />

                <div className="text-xs text-gray-500 mb-3">Ongkir dibayar langsung ke kurir/ojol dan tidak termasuk dalam total pembayaran.</div>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={saveOrder} className="flex-1 bg-[#f08b2d] text-white py-2 rounded-md font-semibold hover:brightness-95">Simpan & Lanjut</button>
            </div>
          </div>
          {/* NOTES */}
          {checkout?.note && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Catatan Pembeli:</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{checkout.note}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Informasi Toko</h3>

            {method === "pickup" ? (
              <>
                <div className="text-sm text-gray-700 mb-2">{store.addr}</div>
                <div className="text-sm text-gray-500 mb-3">Jam operasional: {store.hoursText}</div>
                <div className="text-sm text-gray-600 mb-3">Silakan ambil pesanan di toko pada waktu yang dipilih. Bawa bukti pembayaran atau konfirmasi pemesanan.</div>
                <a href={getMapsLink()} target="_blank" rel="noreferrer" className="inline-block px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">Lihat di Google Maps</a>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-700 mb-2">Kirim ke alamat pembeli (delivery)</div>
                <div className="text-sm text-gray-500 mb-3">Ongkir dibayar langsung ke kurir/ojol. Kami dapat bantu konfirmasi ke toko via WhatsApp jika perlu.</div>
                <div className="flex gap-2">
                  <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:brightness-95">
                    Chat via WhatsApp
                  </a>
                  <a href={getMapsLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">
                    Lihat Lokasi Toko
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold mb-3">Ringkasan Item</h4>
            <ItemList />
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Ringkasan Pembayaran</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><div>Subtotal</div><div>{fmtRp(subtotal)}</div></div>
              <div className="flex justify-between text-sm text-gray-600"><div>Biaya Packing</div><div>{fmtRp(PACKING_FEE)}</div></div>
              <div className="flex justify-between text-sm font-semibold mt-2"><div>Total</div><div>{fmtRp(total)}</div></div>
            </div>
            <div className="text-xs text-gray-500 mt-3">Catatan: Ongkir tidak termasuk dalam total. Pembayaran ongkir dilakukan langsung ke kurir/ojol saat pengantaran.</div>
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
                  <div className="text-xs text-gray-500">Hanya untuk Pick Up</div>
                </div>
              </label>
            </div>

            <div className="mt-4 text-right">
              <button onClick={saveOrder} className="px-4 py-2 bg-[#f08b2d] text-white rounded-md font-semibold hover:brightness-95">Lanjut ke Pembayaran</button>
            </div>
          </div>
        </div>
      </div>

      <Popup {...popup} />
    </div>
  );
}
