import React from "react";

const fmtRp = (n = 0) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

export default function InvoiceCard({ invoiceNo, transCode, date, status, items = [], packingFee = 0, total }) {
  return (
    <div className="max-w-md mx-auto">
      {/* outer card with soft blue bg and small orange ribbon */}
      <div className="relative bg-gradient-to-b from-sky-50 to-sky-100 rounded-2xl p-4 shadow-md overflow-hidden">
        {/* small orange tab */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="w-20 h-3 bg-orange-400 rounded-t-lg shadow-sm"></div>
        </div>

        {/* inner content container */}
        <div className="rounded-xl bg-white/60 backdrop-blur-sm p-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Invoice Pesanan</h3>

          {/* info block */}
          <div className="bg-sky-50 rounded-lg p-3 text-sm text-slate-700 mb-3">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-xs text-slate-500">Nomor Invoice</div>
              <div className="text-sm font-medium text-slate-800 text-right">{invoiceNo}</div>

              <div className="text-xs text-slate-500">Tanggal Pemesanan</div>
              <div className="text-sm text-slate-800 text-right">{date}</div>

              <div className="text-xs text-slate-500">Kode Transaksi</div>
              <div className="text-sm text-slate-800 text-right">{transCode}</div>

              <div className="text-xs text-slate-500">Status</div>
              <div className="text-sm text-amber-700 font-medium text-right">{status}</div>
            </div>
          </div>

          {/* items block */}
          <div className="bg-sky-50 rounded-lg p-3 text-sm text-slate-700">
            <ul className="space-y-2">
              {items.map((it, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="truncate text-slate-800">
                    {it.name} {it.qty > 1 ? `x ${it.qty}` : ""}
                  </div>
                  <div className="text-slate-800">{fmtRp((it.price || 0) * (it.qty || 1))}</div>
                </li>
              ))}

              {/* packing fee row */}
              <li className="flex items-center justify-between pt-2 border-t border-sky-100">
                <div className="text-slate-800">Packaging</div>
                <div className="text-slate-800">{fmtRp(packingFee)}</div>
              </li>
            </ul>
          </div>

          {/* dashed separator */}
          <div className="flex items-center justify-between my-4">
            <div className="flex-1 h-px border-t border-dashed border-slate-200" />
            <div className="w-6 h-6 bg-white rounded-full -mx-3 border border-slate-100" />
            <div className="flex-1 h-px border-t border-dashed border-slate-200" />
          </div>

          {/* total + icon */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total Pembayaran</div>
              <div className="text-2xl font-bold text-slate-900">{fmtRp(total)}</div>
            </div>

            {/* document icon in rounded square */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-3 bg-slate-100 rounded-xl shadow-sm hover:bg-slate-200"
                title="Download invoice"
                onClick={() => {
                  // optional: implement download handler via props or event
                  // For now do nothing (placeholder)
                }}
              >
                {/* simple document icon SVG */}
                <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 13h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 17h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
