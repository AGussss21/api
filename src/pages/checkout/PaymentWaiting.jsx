// src/pages/checkout/PaymentWaiting.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

function readCheckout() {
  try {
    return JSON.parse(sessionStorage.getItem("user_checkout")) || null;
  } catch {
    return null;
  }
}
function readPaymentMeta() {
  try {
    return JSON.parse(sessionStorage.getItem("payment_meta")) || {};
  } catch {
    return {};
  }
}
function savePaymentMeta(meta) {
  try {
    sessionStorage.setItem("payment_meta", JSON.stringify(meta));
  } catch {}
}

/** generate a simple SVG dataURL which acts as QR placeholder */
function svgDataUrlFromText(qrText) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'>
    <rect width='100%' height='100%' fill='#ffffff'/>
    <rect x='12' y='12' width='60' height='60' fill='#111827'/>
    <rect x='348' y='12' width='60' height='60' fill='#111827'/>
    <rect x='12' y='348' width='60' height='60' fill='#111827'/>
    <text x='50%' y='86%' font-size='18' font-family='monospace' fill='#374151' text-anchor='middle'>${qrText}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export default function PaymentWaiting() {
  const nav = useNavigate();
  const checkout = useMemo(() => readCheckout(), []);
  const [deadline] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 45);
    return d;
  });
  const [timeLeft, setTimeLeft] = useState("");
  const [meta, setMeta] = useState(() => readPaymentMeta());
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!checkout) nav("/checkout/order-info", { replace: true });
  }, [checkout, nav]);

  // countdown
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, deadline.getTime() - now);
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  // load meta from storage
  useEffect(() => {
    setMeta(readPaymentMeta());
  }, []);

  if (!checkout) return null;
  const { total, selectedMethod, transCode } = checkout;

  // ensure persistent meta for this transCode exists
  useEffect(() => {
    const pm = readPaymentMeta();
    if (!pm[transCode]) {
      const rnd = () => Math.random().toString(36).slice(2, 10).toUpperCase();
      let obj = { createdAt: new Date().toISOString() };
      const m = (selectedMethod || "").toLowerCase();
      if (m.includes("gopay") || m.includes("e-wallet") || m.includes("shopeepay") || m.includes("ovo")) {
        obj.qrText = `QR:${transCode}:${rnd()}`;
      } else if (m.includes("virtual") || m.includes("bank")) {
        obj.vaNumber = "VA" + Math.floor(1000000000 + Math.random() * 9000000000);
      } else if (m.includes("indomaret") || m.includes("alfamart")) {
        obj.payCode = "PAY" + rnd().slice(0, 8);
      } else {
        obj.infoCode = rnd().slice(0, 8);
      }
      pm[transCode] = obj;
      savePaymentMeta(pm);
      setMeta(pm);
    }
  }, [transCode, selectedMethod]);

  const paymentMeta = meta[transCode] || {};
  const isEwallet =
    (selectedMethod || "").toLowerCase().includes("gopay") ||
    (selectedMethod || "").toLowerCase().includes("e-wallet") ||
    (selectedMethod || "").toLowerCase().includes("shopeepay") ||
    (selectedMethod || "").toLowerCase().includes("ovo");
  const isVA =
    (selectedMethod || "").toLowerCase().includes("virtual") ||
    (selectedMethod || "").toLowerCase().includes("bank");
  const isConvenience =
    (selectedMethod || "").toLowerCase().includes("indomaret") ||
    (selectedMethod || "").toLowerCase().includes("alfamart");

  function handleCheckStatus() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      nav(`/orders/${encodeURIComponent(transCode)}`);
    }, 300);
  }

  const qrDataUrl = paymentMeta.qrText ? svgDataUrlFromText(paymentMeta.qrText) : null;

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

      <h3 className="text-2xl font-extrabold text-gray-800 text-center mb-4">Menunggu Pembayaran — <span className="font-semibold">{selectedMethod}</span></h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* left: QR / instruksi */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="inline-flex items-center bg-yellow-50 border border-yellow-100 rounded-full px-3 py-1 text-sm font-semibold text-yellow-800">Batas Waktu Pembayaran</div>
                <div className="text-sm font-semibold text-gray-700">{timeLeft}</div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
                <div className="text-xs text-gray-500 mb-2">{selectedMethod} • Instruksi Pembayaran</div>

                {/* E-wallet: QR */}
                {isEwallet && qrDataUrl && (
                  <>
                    <img src={qrDataUrl} alt="QR Pembayaran" className="mx-auto w-56 h-56 object-cover rounded-lg" />
                    <div className="text-sm text-gray-600 mt-4">QR Data: <span className="font-mono text-sm text-gray-800">{paymentMeta.qrText}</span></div>
                    <div className="text-sm text-gray-600 mt-2">Total: <span className="font-semibold">{fmtRp(total)}</span> • Waktu tersisa: <span className="font-semibold">{timeLeft}</span></div>

                    <div className="bg-gray-100 border border-gray-100 rounded-lg text-left mt-4 p-4">
                      <div className="font-semibold mb-2">Langkah bayar (E-wallet)</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Buka aplikasi e-wallet (contoh: GOJEK / GoPay).</li>
                        <li>Pilih menu <span className="italic">Scan QR</span>.</li>
                        <li>Arahkan kamera ke QR di atas.</li>
                        <li>Periksa nominal {fmtRp(total)} dan konfirmasi pembayaran.</li>
                        <li>Tunggu notifikasi pembayaran berhasil.</li>
                      </ol>
                    </div>
                  </>
                )}

                {/* Virtual Account */}
                {isVA && paymentMeta.vaNumber && (
                  <>
                    <div className="text-2xl font-semibold mt-4 font-mono">{paymentMeta.vaNumber}</div>
                    <div className="text-sm text-gray-600 mt-2">Total: <span className="font-semibold">{fmtRp(total)}</span> • Waktu tersisa: <span className="font-semibold">{timeLeft}</span></div>

                    <div className="bg-gray-100 border border-gray-100 rounded-lg text-left mt-4 p-4">
                      <div className="font-semibold mb-2">Langkah bayar (Virtual Account)</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Buka Mobile Banking / Internet Banking / ATM / Aplikasi Bank.</li>
                        <li>Pilih menu Transfer → Virtual Account / Pembayaran → Masukkan nomor VA.</li>
                        <li>Masukkan nomor VA: <span className="font-mono">{paymentMeta.vaNumber}</span>.</li>
                        <li>Periksa nama & nominal ({fmtRp(total)}), lalu konfirmasi transfer.</li>
                        <li>Simpan bukti transfer; tunggu konfirmasi otomatis.</li>
                      </ol>
                    </div>
                  </>
                )}

                {/* Convenience store */}
                {isConvenience && paymentMeta.payCode && (
                  <>
                    <div className="text-2xl font-semibold mt-4 font-mono">{paymentMeta.payCode}</div>
                    <div className="text-sm text-gray-600 mt-2">Tunjukkan kode ini ke kasir • Waktu tersisa: <span className="font-semibold">{timeLeft}</span></div>

                    <div className="bg-gray-100 border border-gray-100 rounded-lg text-left mt-4 p-4">
                      <div className="font-semibold mb-2">Langkah bayar (Gerai / Kasir)</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Datang ke kasir Indomaret / Alfamart.</li>
                        <li>Tunjukkan kode pembayaran: <span className="font-mono">{paymentMeta.payCode}</span>.</li>
                        <li>Bayar tunai / non-tunai sesuai pilihan kasir.</li>
                        <li>Simpan struk/resi sebagai bukti pembayaran.</li>
                      </ol>
                    </div>
                  </>
                )}

                {/* Fallback: ATM / Card / lainnya */}
                {!isEwallet && !isVA && !isConvenience && (
                  <>
                    <div className="text-sm text-gray-600 mt-3">Total: <span className="font-semibold">{fmtRp(total)}</span> • Waktu tersisa: <span className="font-semibold">{timeLeft}</span></div>
                    <div className="bg-gray-100 border border-gray-100 rounded-lg text-left mt-4 p-4">
                      <div className="font-semibold mb-2">Langkah bayar ({selectedMethod})</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Untuk kartu: masukkan detail kartu pada halaman pembayaran (jika tersedia).</li>
                        <li>Untuk ATM/Bank Transfer: ikuti instruksi bank / masukkan referensi yang diperlukan.</li>
                        <li>Jika tersedia kode: gunakan kode di bawah ini.</li>
                      </ol>
                      {paymentMeta.infoCode && <div className="mt-2 font-mono text-sm text-gray-800">Kode: {paymentMeta.infoCode}</div>}
                    </div>
                  </>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleCheckStatus}
                    className="px-4 py-2 w-full border border-gray-200 rounded-lg text-white text-sm bg-brand hover:bg-yellow-500"
                  >
                    {checking ? "Memeriksa..." : "Periksa Status Pesanan"}
                  </button>
                </div>

                <div className="mt-5 text-sm text-gray-600 text-left">
                  <div className="font-semibold mb-1">Catatan penting</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Nomor VA / kode / QR di atas dibuat sekali dan <span className="font-medium">tidak</span> berubah selama sesi.</li>
                    <li>Jangan bagikan bukti pembayaran ke pihak yang tidak bertanggung jawab.</li>
                    <li>Jika sudah bayar tapi status belum berubah, buka halaman Status Pesanan atau hubungi layanan pelanggan.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* right: contact & actions */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="text-lg font-semibold">Butuh Bantuan?</div>
              <div>
                <div className="text-sm text-gray-600"><span className="font-semibold">Email :</span> lolacake@gmail.com</div>
                <div className="text-sm text-gray-600"><span className="font-semibold">WhatsApp :</span> 0852-4193-1688</div>
              </div>
              <div className="text-sm text-gray-600">Kamu punya waktu <span className="font-semibold">~45 menit</span> untuk menyelesaikan pembayaran. Setelah lewat batas, pesanan akan kadaluarsa.</div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => nav("/")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  Kembali ke Beranda
                </button>
                <button
                  onClick={() => nav("/checkout/order-info")}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  Ubah Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}