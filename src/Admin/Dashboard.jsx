import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown } from "lucide-react";
import { api } from "../lib/api";
import Popup from "../components/Popup";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("added_at");
  const [selected, setSelected] = useState([]);
  const [popup, setPopup] = useState({ open: false });
  const [loading, setLoading] = useState(false);

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const fetchProducts = async () => {
  try {
    const res = await api.getNoAuth("/products");
    console.log("API RESPONSE:", res);

    setProducts(res);   // FIX DI SINI
  } catch (err) {
    showPopup({
      type: "error",
      message: "Gagal mengambil produk",
      okText: "OK",
      onOk: closePopup
    });
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(selected.map((id) => api.delete(`/admin/products/${id}`)));
      showPopup({ type: "success", message: "Produk berhasil dihapus", okText: "OK", onOk: closePopup });
      setSelected([]);
      fetchProducts();
    } catch (err) {
      showPopup({ type: "error", message: "Gagal menghapus produk", okText: "OK", onOk: closePopup });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "added_at") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  // Helper untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const d = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: '2-digit' });
    const t = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${d} at ${t}`;
  };

  // Helper format harga
  const formatPrice = (price) => {
    return "Rp" + price.toLocaleString('id-ID');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Manajemen Produk</h1>
          <p className="text-gray-600 text-sm">
            Admin dapat menambahkan, mengubah, dan menghapus produk
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#F2994A] text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition shadow-sm"
          onClick={() => navigate("/admin/product")}
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {/* --- Container --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 pb-20 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Manajemen Produk</h2>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* --- Label Kolom --- */}
        <div className="grid grid-cols-[150px_1.5fr_1fr_1.5fr_0.5fr_1fr_120px] gap-4 items-center text-sm font-semibold text-black mb-4 px-4">
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-white hover:bg-gray-50 w-fit">
              <select
                className="appearance-none bg-transparent text-sm focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="added_at">Sort by</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
              <ChevronDown className="text-gray-500 ml-2" size={14} />
            </div>

            <div>Nama Produk</div>
            <div>Harga</div>
            <div>Added at</div>
            <div>Stock</div>
            <div>Category</div>
            <div></div>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* --- List Produk --- */}
        <div className="space-y-4">
          {filtered.map((p) => (
            <div key={p.id} className="grid grid-cols-[150px_1.5fr_1fr_1.5fr_0.5fr_1fr_120px] gap-4 items-center bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="pl-2">
                <input 
                  type="checkbox" 
                  checked={selected.includes(p.id)} 
                  onChange={() => toggleSelect(p.id)}
                  className="w-5 h-5 text-[#86BC42] bg-gray-100 border-gray-300 rounded focus:ring-[#86BC42] focus:ring-2 accent-[#86BC42] cursor-pointer"
                />
              </div>

              <div className="text-gray-700">{p.name}</div>
              <div className="font-bold text-gray-900">{formatPrice(p.price)}</div>
              <div className="text-gray-500 text-sm">{formatDate(p.created_at)}</div>
              <div className="text-gray-900 font-medium">{p.stock}</div>
              <div className="text-gray-600">{p.category}</div>

              <div className="text-right">
                <button
                  onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                  className="bg-[#EA923E] hover:bg-orange-500 text-white text-sm px-4 py-2 rounded-md font-medium transition"
                >
                  Edit Produk
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">Tidak ada produk ditemukan.</div>
          )}
        </div>

        {/* --- Tombol Hapus --- */}
        <div className="flex justify-end mt-8">
           <button
            onClick={handleDelete}
            disabled={selected.length === 0 || loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${
              selected.length === 0 
                ? "bg-red-300 cursor-not-allowed hidden" // Hidden jika tidak ada yang dipilih (sesuai UX umum), atau opacity-50
                : "bg-[#EB5757] hover:bg-red-600 shadow-sm"
            }`}
          >
            Hapus produk
          </button>
        </div>
      </div>

      <Popup {...popup} />
    </div>
  );
}