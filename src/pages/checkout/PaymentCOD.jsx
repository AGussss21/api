import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceCard from "../../components/InvoiceCard";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

function readOrder() {
  try {
    return JSON.parse(sessionStorage.getItem("user_order")) || null;
  } catch {
    return null;
  }
}

export default function PaymentCOD() {
  const nav = useNavigate();
  const order = useMemo(() => readOrder(), []);

  useEffect(() => {
    if (!order) {
      // apabila tidak ada order, arahkan kembali ke order-info
      nav("/checkout/order-info", { replace: true });
    }
  }, [order, nav]);

  if (!order) return null;

  const { total, checkout } = order;
  const items = checkout?.items || [];

  // prefer fields from saved order, fallback to generated ones
  const invoiceNo = order?.invoiceNo || `INV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
  const kodeTrans = order?.transCode || `MID${String(Date.now()).slice(-8)}`;
  const tanggal = order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID");
  const status = order?.status || "Menunggu Pembayaran";
  const packingFee = typeof order?.packingFee !== "undefined" ? order.packingFee : (order?.packingFee ?? 5000);
  const subtotal = typeof order?.subtotal !== "undefined" ? order.subtotal : items.reduce((s,i)=>s+(i.price||0)*(i.qty||1),0);

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

      {/* Success banner */}
      <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 font-semibold">
        Pesanan berhasil dibuat
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: InvoiceCard visual */}
        <div className="lg:col-span-4">
          <InvoiceCard
            invoiceNo={invoiceNo}
            transCode={kodeTrans}
            date={tanggal}
            status={status}
            items={items}
            packingFee={packingFee}
            total={total}
          />
        </div>

        {/* RIGHT: Payment info */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 font-semibold text-sm">Informasi Pembayaran</div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-2xl font-bold">{fmtRp(total)}</div>
                <div className="text-xs text-gray-400 mt-1">Order ID {kodeTrans}</div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-md p-4 text-sm text-gray-700">
                Pesanan akan diproses. Untuk metode COD, pembayaran dapat dilakukan saat pengambilan di toko atau kepada kurir saat pengantaran.
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // simple info modal / alert (replace with proper UI if needed)
                    alert("Status pembayaran COD akan terlihat setelah kasir/kurir melakukan konfirmasi pada sistem.");
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                >
                  Lihat Status
                </button>

                <button
                  onClick={() => nav("/")}
                  className="w-full sm:w-auto px-4 py-2 bg-[#f08b2d] text-white rounded-md text-sm font-semibold hover:brightness-95"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
