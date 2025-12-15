import React, { useState, useMemo } from 'react';
import { ChevronDown, X, RefreshCw } from 'lucide-react';
import Popup from '../components/Popup';
import axios from "axios";
import { useEffect } from "react"

const API_ROOT = import.meta.env.VITE_API_BASE_URL;


const mapPaymentStatus = (status) => {
  switch (status) {
    case "PENDING": return "Menunggu";
    case "PAID": return "Diterima";
    case "FAILED": return "Ditolak";
    default: return "Menunggu";
  }
};

const mapOrderStatus = (status) => {
  switch (status) {
    case "PENDING": return "Belum Dibayar";
    case "PAID": return "Sedang Diproses";
    case "FAILED": return "Dibatalkan";
    default: return "Belum Dibayar";
  }
};


const ModalOverlay = ({ children, onClose }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity">
    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up relative">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer">
        <X size={20} />
      </button>
      {children}
    </div>
  </div>
);

export default function OrderManagement() {
   const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/orders`);
      const data = res.data;

      const formatted = data.map(o => ({
        id: o.trans_code,
        customer: o.meta?.customer_name || "Pelanggan",
        price: Number(o.total),
        payStatus: mapPaymentStatus(o.status),
        orderStatus: mapOrderStatus(o.status),
        date: new Date(o.created).toLocaleString("id-ID"),
        method: o.meta?.gateway?.snap?.raw?.payment_type || "-",
      }));

      setOrders(formatted);

    } catch (err) {
      console.error("Failed fetch orders:", err);
    }
  };

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPay, setFilterPay] = useState('');
  const [filterOrder, setFilterOrder] = useState('');

  // State Modal
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempStatus, setTempStatus] = useState('');

  const [popup, setPopup] = useState({ open: false });
  const showPopup = (opts) => setPopup({ open: true, ...opts });
  const closePopup = () => setPopup((p) => ({ ...p, open: false }));

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case 'Belum Dibayar': return 'bg-gray-100 text-gray-600';
      case 'Sedang Diproses': return 'bg-blue-100 text-blue-700';
      case 'Siap Diambil': return 'bg-indigo-100 text-indigo-700';
      case 'Siap Dikirim': return 'bg-purple-100 text-purple-700';
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Dibatalkan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q);

      const matchPay = filterPay ? order.payStatus === filterPay : true;
      const matchOrder = filterOrder ? order.orderStatus === filterOrder : true;

      return matchSearch && matchPay && matchOrder;
    });
  }, [orders, searchQuery, filterPay, filterOrder]);

  const handleOpenModal = (type, item) => {
    setSelectedItem(item);
    setActiveModal(type);
    if (type === 'status') setTempStatus(item.orderStatus);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setTempStatus('');
  };

  const handleUpdateStatus = (newOrderStatus) => {
    if (!selectedItem) return;
    const updated = orders.map(o => o.id === selectedItem.id ? { ...o, orderStatus: newOrderStatus } : o);
    setOrders(updated);
    handleCloseModal();
    showPopup({
      type: "success",
      title: "Status Tersimpan",
      message: `Status pesanan ${selectedItem.id} diubah menjadi "${newOrderStatus}".`,
      okText: "OK",
      onOk: () => closePopup()
    });
  };

  const handleVerifyPayment = (isAccepted) => {
    if (!selectedItem) return;
    const updated = orders.map(o =>
      o.id === selectedItem.id ? {
        ...o,
        payStatus: isAccepted ? 'Diterima' : 'Ditolak',
        orderStatus: isAccepted ? 'Sedang Diproses' : 'Dibatalkan'
      } : o
    );
    setOrders(updated);
    handleCloseModal();
    showPopup({
      type: isAccepted ? "success" : "error",
      title: isAccepted ? "Pembayaran Diterima" : "Pembayaran Ditolak",
      message: isAccepted ? `Pembayaran ${selectedItem.id} telah diterima.` : `Pembayaran ${selectedItem.id} ditolak.`,
      okText: "OK",
      onOk: () => closePopup()
    });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const handleRefresh = () => {
  fetchOrders();
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Status Pemesanan & Verifikasi</h1>
            <p className="text-gray-600 mb-2 text-sm md:text-base">Admin dapat meninjau dan memverifikasi status pembayaran pelanggan.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm" title="Refresh Data">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between mb-2">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
              <div className="relative w-full md:w-auto">
                <select
                  className="w-full md:w-auto appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-full text-xs font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-300"
                  value={filterPay}
                  onChange={(e) => setFilterPay(e.target.value)}
                >
                  <option value="">Filter Status Pembayaran</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="relative">
                <select
                  className="w-full md:w-auto appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-full text-xs font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-300"
                  value={filterOrder}
                  onChange={(e) => setFilterOrder(e.target.value)}
                >
                  <option value="">Filter Status Pesanan</option>
                  <option value="Belum Dibayar">Belum Dibayar</option>
                  <option value="Sedang Diproses">Sedang Diproses</option>
                  <option value="Siap Diambil">Siap Diambil</option>
                  <option value="Siap Dikirim">Siap Dikirim</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <div className="relative w-full xl:w-64">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-0 md:p-0">
          <div className="w-full text-left text-sm">
            <div className="hidden md:grid grid-cols-[0.8fr_1.5fr_1fr_1fr_1fr_1.4fr] gap-4 px-6 py-4 font-semibold text-gray-900 border-b border-gray-100 items-center">
              <div>Order id</div>
              <div>Pelanggan</div>
              <div>Harga</div>
              <div>Status Pembayaran</div>
              <div>Status Pemesanan</div>
              <div className="text-center">Aksi</div>
            </div>

            <div className="flex flex-col p-4 md:p-0">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((item, index) => (
                  <div key={index} className="bg-white border-b border-gray-100 shadow-sm hover:bg-gray-50 transition p-4">
                    <div className="flex flex-col gap-3 md:gap-4 md:grid md:grid-cols-[0.8fr_1.5fr_1fr_1fr_1fr_1.4fr] md:items-center">
                      <div className="flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">ID:</span>
                        <span className="text-gray-600 font-medium">{item.id}</span>
                      </div>

                      <div className="flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">Pelanggan:</span>
                        <span className="font-medium text-gray-900 truncate" title={item.customer}>{item.customer}</span>
                      </div>

                      <div className="flex justify-between md:block">
                        <span className="md:hidden font-semibold text-gray-500">Harga:</span>
                        <span className="font-bold text-gray-700">{formatRupiah(item.price)}</span>
                      </div>

                      <div className="flex justify-between items-center md:block">
                        <span className="md:hidden font-semibold text-gray-500">Pembayaran:</span>
                        <div className={`px-2 py-1 rounded-full text-xs w-fit font-center font-medium ${
                          item.payStatus === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' :
                          item.payStatus === 'Diterima' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.payStatus}
                        </div>
                      </div>

                      <div className="flex justify-between items-center md:block">
                        <span className="md:hidden font-semibold text-gray-500">Pesanan:</span>
                        <div className={`px-2 py-1 rounded-full text-xs w-fit font-medium text-center ${getOrderStatusStyle(item.orderStatus)}`}>
                          {item.orderStatus}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end md:justify-center mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button onClick={() => handleOpenModal('detail', item)} className="px-3 py-1.5 rounded border border-green-500 text-green-600 text-xs font-semibold hover:bg-green-50 transition">
                          Detail
                        </button>

                        {item.payStatus === 'Menunggu' ? (
                          <button onClick={() => handleOpenModal('verify', item)} className="w-[100px] px-3 py-1.5 rounded border border-green-500 text-green-600 text-xs font-semibold hover:bg-green-50 transition">
                            Verifikasi
                          </button>
                        ) : item.payStatus === 'Diterima' ? (
                          <button onClick={() => handleOpenModal('status', item)} className="w-[100px] px-3 py-1.5 rounded border border-green-500 text-green-600 text-xs font-semibold hover:bg-green-50 transition">
                            Ubah Status
                          </button>
                        ) : (
                          <div className="hidden md:block w-[100px]"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  Tidak ada data ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Popup {...popup} onClose={closePopup} />

      {activeModal === 'detail' && selectedItem && (
        <ModalOverlay onClose={handleCloseModal}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-amber-900 uppercase mb-4 tracking-wide">Detail</h2>
            <hr className="mb-4 border-gray-200"/>
            <p className="text-gray-600 mb-6 text-sm">Periksa detail transaksi sebelum memverifikasi pembayaran.</p>
            <div className="space-y-3 text-sm font-medium text-black">
              <div className="flex"><span className="w-40">ID Transaksi</span>: {selectedItem.id}</div>
              <div className="flex"><span className="w-40">Tanggal Transaksi</span>: {selectedItem.date}</div>
              <div className="flex"><span className="w-40">Nama Pelanggan</span>: {selectedItem.customer}</div>
              <div className="flex"><span className="w-40">Total Pembayaran</span>: {formatRupiah(selectedItem.price)}</div>
              <div className="flex"><span className="w-40">Metode Pembayaran</span>: {selectedItem.method}</div>
              <div className="flex items-center">
                <span className="w-40">Status Saat Ini</span>: <span className="flex items-center gap-1">⏳ {selectedItem.payStatus}</span>
              </div>
            </div>
            <p className="mt-6 mb-2 text-gray-600 text-sm">Pilih hasil verifikasi pembayaran:</p>
            <div className="mt-8 flex justify-end">
              <button onClick={handleCloseModal} className="bg-[#F2994A] hover:bg-orange-600 text-white font-medium py-2 px-8 rounded shadow-md transition-colors">
                Kembali
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {activeModal === 'verify' && selectedItem && (
        <ModalOverlay onClose={handleCloseModal}>
          <div className="p-8">
            <div className="mb-4">
               <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">💳 Verifikasi Pembayaran</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Periksa detail transaksi sebelum memverifikasi pembayaran.</p>
            <div className="space-y-3 text-sm font-medium text-black">
              <div className="flex"><span className="w-40">ID Transaksi</span>: {selectedItem.id}</div>
              <div className="flex"><span className="w-40">Tanggal Transaksi</span>: {selectedItem.date}</div>
              <div className="flex"><span className="w-40">Nama Pelanggan</span>: {selectedItem.customer}</div>
              <div className="flex"><span className="w-40">Total Pembayaran</span>: {formatRupiah(selectedItem.price)}</div>
              <div className="flex"><span className="w-40">Metode Pembayaran</span>: {selectedItem.method}</div>
              <div className="flex items-center">
                <span className="w-40">Status Saat Ini</span>: <span className="flex items-center gap-1">⏳ Menunggu Verifikasi</span>
              </div>
            </div>
            <p className="mt-6 text-gray-600 text-sm">Pilih hasil verifikasi pembayaran:</p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => handleVerifyPayment(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded transition-colors">Ditolak</button>
              <button onClick={() => handleVerifyPayment(true)} className="flex-1 bg-[#F2994A] hover:bg-orange-600 text-white font-medium py-3 rounded shadow-md transition-colors">Diterima</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {activeModal === 'status' && selectedItem && (
        <ModalOverlay onClose={handleCloseModal}>
          <div className="p-8 w-full">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Ubah Status Pesanan</h2>
            <hr className="mb-6 border-gray-200"/>
            <p className="text-gray-600 mb-4 text-sm">Pilih status terbaru untuk pesanan ini:</p>
            <div className="space-y-4 mb-8">
              {['Sedang Diproses', 'Siap Diambil', 'Siap Dikirim', 'Selesai', 'Dibatalkan'].map((status) => (
                <label key={status} className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="status_order"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-400 checked:border-gray-600 transition-all"
                      checked={tempStatus === status}
                      onChange={() => setTempStatus(status)}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="ml-3 text-gray-800 font-medium text-sm group-hover:text-black">{status}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={handleCloseModal} className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded transition-colors">Batal</button>
              <button onClick={() => handleUpdateStatus(tempStatus)} className="flex-1 bg-[#F2994A] hover:bg-orange-600 text-white font-medium py-3 rounded shadow-md transition-colors">Simpan</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

