import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

function readOrderFromStorage(transCode) {
  try {
    const c = JSON.parse(sessionStorage.getItem("user_checkout") || "null");
    if (c && c.transCode === transCode) return c;
    const u = JSON.parse(sessionStorage.getItem("user_order") || "null");
    if (u && u.transCode === transCode) return u;
    return null;
  } catch {
    return null;
  }
}

function persistOrderStatus(transCode, nextOrder) {
  try {
    const storedCheckout = JSON.parse(sessionStorage.getItem("user_checkout") || "null");
    if (storedCheckout && storedCheckout.transCode === transCode) {
      const merged = { ...storedCheckout, ...nextOrder };
      sessionStorage.setItem("user_checkout", JSON.stringify(merged));
    }
    const storedOrder = JSON.parse(sessionStorage.getItem("user_order") || "null");
    if (storedOrder && storedOrder.transCode === transCode) {
      const merged2 = { ...storedOrder, ...nextOrder };
      sessionStorage.setItem("user_order", JSON.stringify(merged2));
    }
  } catch (e) {
  }
}

export default function OrderStatus() {
  const { transCode } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(() => readOrderFromStorage(transCode));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrder(readOrderFromStorage(transCode));
  }, [transCode]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order tidak ditemukan</h2>
          <p className="text-sm text-gray-600 mb-4">Tidak ada data order dengan ID <strong>{transCode}</strong> pada sesi ini.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => nav("/")} className="px-4 py-2 border rounded-md">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    );
  }

  const status = order.status || "Menunggu Pembayaran";
  const buyer = order.receiver || { name: "-", phone: "-", email: "-" };
  const store = order.store || null;
  const checkout = order.checkout || {};
  const items = checkout.items || [];
  const paymentMeta = (() => {
    try {
      const all = JSON.parse(sessionStorage.getItem("payment_meta") || "{}");
      return all[order.transCode] || {};
    } catch {
      return {};
    }
  })();

  useEffect(() => {
  if (!transCode) return;

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/payments/orders/${transCode}`);
      if (!res.ok) return;

      const data = await res.json();

      // 🔑 update state dari DB
      setOrder(prev => ({ ...(prev || {}), ...data }));

      // 🔑 sinkronkan ke sessionStorage
      persistOrderStatus(transCode, {
        status: data.status,
      });
    } catch (e) {
      console.warn("fetch order failed:", e);
    }
  }

  fetchOrder();
}, [transCode]);


  function handleCancelOrder() {
    const ok = window.confirm("Yakin ingin membatalkan pesanan ini? Aksi ini akan membatalkan order dan tidak bisa dikembalikan.");
    if (!ok) return;

    const cancelledAt = new Date().toISOString();
    const next = {
      status: "Dibatalkan",
      cancelledAt,
      cancelledBy: "customer",
    };
    persistOrderStatus(order.transCode, next);
    setOrder(prev => ({ ...(prev || {}), ...next }));
    alert("Pesanan berhasil dibatalkan.");
    nav("/");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-500">Order ID</div>
            <div className="text-lg font-semibold">{order.transCode}</div>
            <div className="text-sm text-gray-500">Invoice: {order.invoiceNo}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-sm font-semibold">{status}</div>
            <div className="text-xs text-gray-400 mt-1">Dibuat: {new Date(order.createdAt || Date.now()).toLocaleString("id-ID")}</div>
            {order.cancelledAt && <div className="text-xs text-red-500 mt-1">Dibatalkan: {new Date(order.cancelledAt).toLocaleString("id-ID")}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: items */}
          <div className="lg:col-span-2">
            <h3 className="text-md font-semibold mb-3">Ringkasan Pesanan</h3>

            <div className="rounded-lg overflow-hidden">
              {items.map((it) => (
                <div key={it._key || it.id} className="flex items-center gap-4 px-4 py-2 border border-gray-200 rounded-lg mb-3">
                  <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                    {it.img ? (
                      <img src={it.img} alt={it.name} className="w-full h-full object-contain" onError={(e)=>e.currentTarget.style.display='none'} />
                    ) : (
                      <div className="text-xs text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{it.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Jumlah: {it.qty}</div>
                  </div>

                  <div className="text-sm font-semibold">{fmtRp((it.price || 0) * (it.qty || 1))}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: store, payment, totals */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Metode Pembayaran</div>
                <div className="text-sm font-semibold">{order.selectedMethod}</div>
              </div>

              <div className="mt-3 text-sm text-gray-700 space-y-2">
                {paymentMeta.vaNumber && (
                  <div>
                    <div className="text-xs text-gray-500">Virtual Account</div>
                    <div className="font-mono font-medium">{paymentMeta.vaNumber}</div>
                  </div>
                )}

                {paymentMeta.qrText && (
                  <div>
                    <div className="text-xs text-gray-500">QR Data (simulasi)</div>
                    <div className="font-mono text-sm break-words">{paymentMeta.qrText}</div>
                  </div>
                )}

                {paymentMeta.payCode && (
                  <div>
                    <div className="text-xs text-gray-500">Kode Pembayaran</div>
                    <div className="font-mono font-medium">{paymentMeta.payCode}</div>
                  </div>
                )}

                {!paymentMeta.vaNumber && !paymentMeta.qrText && !paymentMeta.payCode && (
                  <div className="text-sm text-gray-500">Instruksi pembayaran akan tampil di sini setelah proses checkout.</div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500">Ringkasan Biaya</div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <div>Subtotal</div>
                  <div className="font-medium">{fmtRp(order.subtotal ?? checkout.total ?? 0)}</div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>Packing fee</div>
                  <div className="font-medium">{fmtRp(order.packingFee ?? 0)}</div>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div>{fmtRp(order.total ?? checkout.total ?? 0)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => nav("/")} className="w-full px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Kembali ke Beranda</button>

              {/* BATALKAN button */}
              <button
                onClick={handleCancelOrder}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                Batalkan Pesanan
              </button>
            </div>
          </div>

        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-xs text-gray-500">Metode Pengambilan / Pengiriman</div>
            <div className="font-medium">{checkout.method || order.mode || "—"}</div>
            {checkout.method === "pickup" && order.pickup && (
              <div className="text-sm text-gray-600 mt-2">
                Hari: <strong>{order.pickup.day}</strong><br />
                Jam: <strong>{order.pickup.time}</strong>
              </div>
            )}
            {checkout.method === "delivery" && order.delivery && (
              <div className="text-sm text-gray-600 mt-2">
                Alamat: <div className="font-medium">{order.delivery.address}</div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="text-xs text-gray-500">Penerima</div>
            <div className="text-sm text-gray-600 mt-1">{buyer.name}</div>
            <div className="text-sm text-gray-600 mt-1">{buyer.phone}</div>
            <div className="text-sm text-gray-600">{buyer.email}</div>
          </div>
          {checkout.note ? (
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <div className="text-xs text-gray-500">Catatan</div>
              <div className="text-sm text-gray-600 mt-1">{checkout.note}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
