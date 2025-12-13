import React, { useEffect, useState } from "react";
import { Search, ChevronDown, Star, Trash2 } from "lucide-react";
import { api } from "../lib/api";

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("newest"); // Default: Terbaru
  const [filterCategory, setFilterCategory] = useState("all"); // Default: Semua

  const categoryMap = {
    1: "Cake",
    2: "Cookie",
    3: "Tradisional",
    4: "Donat"
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.getNoAuth("/testimonials");
      // console.log("Data dari Backend:", res);
      if (Array.isArray(res)) {
        setTestimonials(res);
      } else {
        console.error("Format data salah, diharapkan array:", res);
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Gagal mengambil testimoni:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER & SORT ---
  const processedTestimonials = testimonials
    // 1. Filter Pencarian
    .filter((t) => {
      const searchLower = search.toLowerCase();
      return (
        t.name?.toLowerCase().includes(searchLower) ||
        t.message?.toLowerCase().includes(searchLower)
      );
    })
    // 2. Filter Kategori
    .filter((t) => {
      if (filterCategory === "all") return true;
      return t.products_id == filterCategory; 
    })
    // 3. Sorting
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "rating_high") return b.rating - a.rating;
      if (sortBy === "rating_low") return a.rating - b.rating;
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(processedTestimonials.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Hapus ${selectedIds.length} testimoni terpilih?`)) return;

    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/testimonials/${id}`)));
      alert("Berhasil dihapus!");
      setSelectedIds([]);
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus (Cek role Admin Anda)");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: '2-digit' }) + 
           ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const renderStars = (count) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} fill={i < count ? "#F2C94C" : "#E0E0E0"} stroke="none" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Manajemen Testimoni Pelanggan</h1>
          <p className="text-gray-500 text-sm">
            Admin dapat melihat, meninjau, dan menghapus testimoni pelanggan yang tampil di website.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-full text-xs font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-300"
                >
                  <option value="newest">Sort by Terbaru</option>
                  <option value="oldest">Sort by Terlama</option>
                  <option value="rating_high">Rating Tertinggi</option>
                  <option value="rating_low">Rating Terendah</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-full text-xs font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-300 min-w-[200px]"
                >
                  <option value="all">Semua Produk</option>
                  <option value="1">Cake</option>
                  <option value="2">Cookie</option>
                  <option value="3">Tradisional</option>
                  <option value="4">Donat</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-[50px_1.5fr_1fr_1.5fr_2fr_1fr_0.5fr] gap-4 text-xs font-bold text-gray-900 px-4 mb-4 pb-2">
            <div className="flex justify-center">
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={processedTestimonials.length > 0 && selectedIds.length === processedTestimonials.length}
                className="w-4 h-4 rounded border-gray-300 accent-[#86BC42]"
              />
            </div>
            <div>Nama Pelanggan</div>
            <div>Rating</div>
            <div>Tanggal</div>
            <div>Testimoni</div>
            <div>Category</div>
            <div>Aksi</div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Memuat data...</div>
            ) : processedTestimonials.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>Tidak ada testimoni ditemukan.</p>
              </div>
            ) : (
              processedTestimonials.map((item) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-[50px_1.5fr_1fr_1.5fr_2fr_1fr_0.5fr] gap-4 items-center bg-white border rounded-lg p-4 transition text-sm ${
                    selectedIds.includes(item.id) ? "border-[#86BC42] bg-green-50" : "border-gray-100 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                      className="w-5 h-5 rounded border-gray-300 accent-[#86BC42] cursor-pointer"
                    />
                  </div>
                  <div className="font-medium text-gray-800">{item.name || "Anonim"}</div>
                  <div>{renderStars(item.rating)}</div>
                  <div className="text-gray-500 text-xs">{formatDate(item.created_at)}</div>
                  <div className="text-gray-600 text-xs italic line-clamp-2">"{item.message}"</div>
                  <div className="text-gray-700 font-medium text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                    {categoryMap[item.products_id] || `ID: ${item.products_id}`}
                  </div>
                  <div className="text-gray-500 text-xs font-semibold text-green-600">Aktif</div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button className="px-6 py-2 bg-[#F2994A] hover:bg-orange-500 text-white text-sm font-medium rounded shadow-sm transition">
              Tampilkan Testimoni
            </button>
            <button 
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={`px-6 py-2 text-white text-sm font-medium rounded shadow-sm transition flex items-center gap-2 ${
                selectedIds.length === 0 
                ? "bg-red-300 cursor-not-allowed" 
                : "bg-[#EB5757] hover:bg-red-600"
              }`}
            >
              {selectedIds.length > 0 && <Trash2 size={14}/>}
              Hapus Testimoni {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}