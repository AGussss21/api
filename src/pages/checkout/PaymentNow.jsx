// src/pages/checkout/PaymentNow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceCard from "../../components/InvoiceCard";
import axios from "axios";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

function readOrder() {
  try {
    return JSON.parse(sessionStorage.getItem("user_order")) || null;
  } catch {
    return null;
  }
}

function makeRandomCode(len = 8) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function ensurePaymentMetaFor(transCode, method) {
  const raw = sessionStorage.getItem("payment_meta") || "{}";
  const meta = JSON.parse(raw);

  if (!meta[transCode]) {
    const m = (method || "").toLowerCase();
    const base = { createdAt: new Date().toISOString() };

    if (m.includes("gopay") || m.includes("e-wallet") || m.includes("shopeepay") || m.includes("ovo")) {
      base.qrText = `QR:${transCode}:${makeRandomCode(6)}`;
    } else if (m.includes("virtual") || m.includes("bank")) {
      base.vaNumber = "VA" + makeRandomCode(10);
    } else if (m.includes("indomaret") || m.includes("alfa")) {
      base.payCode = "PAY" + makeRandomCode(8);
    } else {
      base.infoCode = makeRandomCode(8);
    }

    meta[transCode] = base;
    sessionStorage.setItem("payment_meta", JSON.stringify(meta));
  }

  return meta[transCode];
}

// helper: apakah metode dianggap "online" yang butuh Midtrans Snap?
function isOnlineMethod(methodKey) {
  if (!methodKey) return false;
  const m = methodKey.toLowerCase();
  // treat card, bank, virtual, gopay, shopeepay, ovo, indomaret, alfagroup as online
  return (
    m.includes("credit") ||
    m.includes("debit") ||
    m.includes("card") ||
    m.includes("bank") ||
    m.includes("virtual") ||
    m.includes("gopay") ||
    m.includes("e-wallet") ||
    m.includes("shopee") ||
    m.includes("ovo") ||
    m.includes("indomaret") ||
    m.includes("alfa")
  );
}

export default function PaymentNow() {
  const nav = useNavigate();
  const order = useMemo(() => readOrder(), []);
  const [selectedMethod, setSelectedMethod] = useState(order?.selectedMethod || null);
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    if (!order) nav("/checkout/order-info", { replace: true });
  }, [order, nav]);

  if (!order) return null;

  const API_ROOT = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const { total, checkout } = order;
  const items = checkout?.items || [];
  const invoiceNo = order?.invoiceNo || `INV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
  

  const methods = [
    {
      key: "Credit/Debit Card",
      title: "Credit/Debit Card",
      desc: "Pay with Visa, MasterCard, JCB, or Amex",
      img: "/assets/payments/card.png",
    },
    {
      key: "ATM/Bank Transfer",
      title: "ATM / Bank Transfer",
      desc: "Pay from ATM Bersama, Prima or Alto",
      img: "/assets/payments/bank.png",
    },
    {
      key: "Virtual Account",
      title: "Virtual Account",
      desc: "Scan QR code using GOPay or Other e-wallets",
      img: "/assets/payments/virtual-account.png",
    },
    {
      key: "Gopay/other e-Wallets",
      title: "GoPay / e-Wallet",
      desc: "Scan QR code using Gopay or other e-wallets",
      img: "/assets/payments/gopay.png",
    },
    {
      key: "ShopeePay/other e-Wallets",
      title: "ShopeePay / e-Wallet",
      desc: "Scan QR code using ShopeePay or other e-wallets",
      img: "/assets/payments/shopeepay.png",
    },
    {
      key: "OVO",
      title: "OVO",
      desc: "Scan QR code using OVO or other e-wallets",
      img: "/assets/payments/ovo.png",
    },
    {
      key: "Indomaret",
      title: "Indomaret",
      desc: "Pay from Indomaret",
      img: "/assets/payments/indomaret.png",
    },
    {
      key: "Alfamart / Alfa Group",
      title: "Alfa Group",
      desc: "Pay from an Alfamart, Alfamidi or Dan+Dan outlet",
      img: "/assets/payments/alfagroup.png",
    },
  ];

  // -----------------------
  // => UPDATED handler:
  // -----------------------
  async function handleProceed() {
    if (!selectedMethod) return;



    // if method is considered online -> call backend & Midtrans snap
    if (isOnlineMethod(selectedMethod)) {
      // prepare items for backend (id, nama, price, qty)
      let itemsForBackend = (items || []).map(it => ({
  id: it.id,
  nama: it.nama || it.title,
  price: Number(it.price),
  qty: Number(it.qty || 1),
}));

// Tambahkan packing fee jika ada
if (order.packingFee && Number(order.packingFee) > 0) {
  itemsForBackend.push({
    id: "PACKING",
    nama: "Packing Fee",
    price: Number(order.packingFee),
    qty: 1
  });
}

      setLoadingPay(true);
      try {
        // create order in backend, get snap token
        const receiverPayload = {
  ...order.receiver,
  address: order.delivery?.address || "-", // ✅ address ikut ke Midtrans
};

const token = localStorage.getItem("token");

const res = await axios.post(
  `${API_ROOT}/payments/orders`,
  {
    user_email: receiverPayload.email,
    receiver: receiverPayload,
    items: itemsForBackend,
    payment_method: "ONLINE",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = res.data;

const backendTransCode = data.trans_code;
const snapToken = data.snap_token;
const redirectUrl = data.redirect_url;


// ✅ BARU BOLEH SIMPAN
const saved = {
  ...order,
  invoiceNo,
  transCode: backendTransCode,
  selectedMethod,
  total,
  createdAt: order.createdAt || new Date().toISOString(),
};

sessionStorage.setItem(
  "user_checkout",
  JSON.stringify({
    ...order,
    invoiceNo,
    transCode: backendTransCode,
    selectedMethod,
    total,
    createdAt: order.createdAt || new Date().toISOString(),
  })
);

sessionStorage.setItem(
  "user_order",
  JSON.stringify({
    ...order,
    transCode: backendTransCode,
    // ❌ JANGAN ADA STATUS
  })
);
ensurePaymentMetaFor(backendTransCode, selectedMethod);

        // if got snapToken -> call window.snap.pay
        if (snapToken && typeof window !== "undefined" && window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: async (result) => {
              console.log("Midtrans success:", result);
              // update backend optionally
              try {
                await axios.post(`${API_ROOT}/payments/orders/confirm`, {
                  order_id: result.order_id,
                  status: "PAID",
                  gateway_data: result,
                });
              } catch (e) {
                console.warn("confirmPayment failed:", e);
              }
              // navigate to success (or order detail)
              nav("/checkout/payment-waiting");
            },
            onPending: (result) => {
              console.log("Midtrans pending:", result);
              // go to waiting page
              nav("/checkout/payment-waiting");
            },
            onError: (err) => {
              console.error("Midtrans error:", err);
              alert("Pembayaran gagal: " + (err?.message || "Cek console"));
            },
            onClose: () => {
              console.log("Midtrans popup closed by user");
            },
          });
        } else if (redirectUrl) {
          // fallback: redirect if midtrans returned a redirect URL
          window.location.href = redirectUrl;
        } else {
          // fallback: jika backend tidak menyediakan snap token, tetap lanjut ke waiting
          nav("/checkout/payment-waiting");
        }
      } catch (err) {
  console.error("Error createOrder/pay:", err);
  console.error("err.response.data:", err.response?.data);
  alert("Gagal memulai pembayaran: " + (err.response?.data?.error || err.message));
}
 finally {
        setLoadingPay(false);
      }
      return;
    }

    // jika bukan online (mis. cash on delivery) -> langsung ke waiting page
    nav("/checkout/payment-waiting");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          1. Cart
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-gray-200 text-[#3d231d] opacity-50">
          2. Order Info
        </div>
        <div className="flex-1 h-1 bg-gray-100"></div>
        <div className="flex-10 text-center py-3 rounded-full font-bold bg-orange-100 text-[#3d231d]">
          3. Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <InvoiceCard
  invoiceNo={invoiceNo}
  transCode={order?.transCode}  // ✅
  date={new Date().toLocaleDateString("id-ID")}
  status={order.status || "Menunggu Pembayaran"}
  items={items}
  packingFee={order.packingFee}
  total={total}
/>

        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 font-semibold text-sm">Pilih Metode Pembayaran</div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-2xl font-bold">{fmtRp(total)}</div>
                  <div className="text-xs text-gray-400 mt-1">
  Order ID {order?.transCode || "-"}   // ✅
</div>
                </div>

                <div className="text-sm text-gray-600">
                  {selectedMethod ? (
                    <>
                      <div className="text-xs text-gray-500">Metode dipilih</div>
                      <div className="font-semibold">{selectedMethod}</div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-400">Pilih metode pembayaran</div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {methods.map((m) => {
                  const isSelected = selectedMethod === m.key;
                  return (
                    <div
                      key={m.key}
                      onClick={() => setSelectedMethod(m.key)}
                      className={`cursor-pointer flex flex-col h-full border rounded-lg px-4 py-2 bg-white transition
                        ${isSelected ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={m.img}
                          alt={m.title}
                          className="w-16 h-16 object-contain"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800">{m.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                        </div>
                        <button
                          className={`px-3 py-1 text-sm rounded-md border w-fit
                            ${isSelected ? "border-orange-600 bg-orange-600 text-white" : "border-gray-200 bg-white"}`}
                        >
                          {isSelected ? "Dipilih" : "Pilih"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => nav("/checkout/order-info")}
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  Ubah Pesanan
                </button>

                <button
                  onClick={handleProceed}
                  disabled={!selectedMethod || loadingPay}
                  className={`ml-auto px-4 py-2 rounded-md text-sm font-semibold 
                    ${selectedMethod && !loadingPay ? "bg-[#f08b2d] text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                >
                  {loadingPay ? "Memproses..." : "Lanjutkan Pembayaran"}
                </button>

                <button
                  onClick={() => nav("/")}
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  Kembali ke Beranda
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-3">
                Silakan pilih metode pembayaran untuk melanjutkan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
