import { useState, useEffect, useRef } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import { adminProductsApi } from "../lib/adminProductsApi";

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [categories] = useState(["Cake", "Snack", "Minuman", "Tradisional"]);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [product, setProduct] = useState({
    name: "",
    category: "",
    type: "",
    price: "",
    description: "",
    imageFile: null,
    stock: 0,
    addStock: 0
  });

  // Ambil data product jika edit
  useEffect(() => {
  if (!id) return;

  setLoading(true);
  adminProductsApi.get(`/${id}`)
    .then(res => {
      const data = res.data;
        console.log("IMAGE NAME:", data.image);
      console.log("FULL URL:", `http://localhost:5000${data.image}`);
      setProduct({
        ...data,
        addStock: 0,
        stock: data.stock || 0,
        imageFile: null,
        type: data.type || ""
      });
      if (data.image) {
        setImagePreview(`http://localhost:5000${data.image}`);
      }
    })
    .catch(err => {
      console.error("Gagal mengambil data produk", err);
      alert("Gagal mengambil data produk.");
    })
    .finally(() => setLoading(false));
}, [id]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  // Submit form
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {

    if (!id && !product.imageFile) {
      alert("Harap upload gambar produk");
      setLoading(false);
      return;
    }
    
    const priceNumber = product.price !== "" ? Number(product.price) : 0;
    const stockAddNumber = product.addStock !== "" && product.addStock !== null
      ? Number(product.addStock)
      : 0;

    const formData = new FormData();

    if (product.product_id) formData.append("product_id", product.product_id);
    formData.append("name", product.name || "");
    formData.append("category", product.category || "");
    formData.append("type", product.type || "");
    formData.append("price", priceNumber);
    formData.append("description", product.description || "");
    formData.append("stock_add", stockAddNumber);

    if (!id) {
      formData.append("stock", stockAddNumber);
    }

    if (product.imageFile) formData.append("image", product.imageFile);

    // ==========================================================
    // ⚠️ DEBUG: CETAK SEMUA DATA YANG DIKIRIMKAN FE KE BACKEND
    // ==========================================================
    for (let pair of formData.entries()) {
      console.log("FORMDATA:", pair[0], pair[1], pair[1] instanceof File);
    }
    // ==========================================================

    let res;
    if (id) {
      res = await adminProductsApi.put(`/${id}`, formData);
    } else {
      res = await adminProductsApi.post("/", formData);
    }

    alert(res.data.message || "Produk berhasil disimpan");
    navigate("/admin/product");

  } catch (err) {
    console.error(err.response?.data || err);
    alert("Gagal menyimpan produk! Lihat console.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
             <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {id ? "Edit Produk" : "Tambah Produk Baru"}
            </h1>
            <p className="text-gray-500">
              Isi detail produk baru yang akan ditambahkan ke katalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gambar Produk */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm sticky top-8">
              <label className="block text-sm font-semibold mb-3">Product image</label>
              <div 
                className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4 relative border border-gray-300 group cursor-pointer" 
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                    <Upload size={32} className="mb-2 opacity-50"/>
                    <p>Klik untuk upload gambar</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="w-full py-2.5 border border-dashed border-gray-400 rounded-lg text-sm font-medium text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <Upload size={16} />
                {imagePreview ? "Change image" : "Add image"}
              </button>
            </div>
          </div>

          {/* Form Detail */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#FFF8C9] p-8 rounded-xl shadow-sm border border-orange-100">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Nama Produk</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                    placeholder="Masukkan Nama Produk Anda"
                    required
                    className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">Tipe</label>
                      <select
                        name="type"
                        value={product.type}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                      >
                        <option value="">Pilih Tipe</option>
                        <option value="satuan">Satuan</option>
                        <option value="paketan">Paketan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-700">Kategori</label>
                      <select 
                        name="category" 
                        value={product.category} 
                        onChange={handleChange} 
                        required
                        className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Harga</label>
                    <div className="relative w-full">
                      <span className="absolute left-4 top-3 text-gray-500 text-sm font-medium">Rp</span>
                      <input 
                        type="number" 
                        name="price" 
                        value={product.price} 
                        onChange={handleChange} 
                        required
                        placeholder="0"
                        className="w-full bg-white border border-transparent rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Deskripsi Produk</label>
                  <textarea 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    rows={5} 
                    placeholder="Tuliskan deskripsi produk..."
                    required
                    className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Manage Stock */}
            <div className="bg-[#FFF8C9] p-8 rounded-xl shadow-sm border border-orange-100">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Manage Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Tambahkan Stok Produk</label>
                  <input 
                      type="number" 
                      name="addStock" 
                      value={product.addStock} 
                      onChange={handleChange} 
                      min={0}
                      className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Total Stok Saat Ini:</label>
                  <div className="text-3xl font-extrabold text-gray-900 mt-1">
    {Number(product.stock) + Number(product.addStock)}
</div>

                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                onClick={() => navigate("/admin/product")}
                className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                disabled={loading}
              >
                Batal
              </button>
              {id && (
  <button
    type="button"
    onClick={async () => {
      if (!window.confirm("Apakah anda yakin ingin menghapus produk ini?")) return;
      setLoading(true);
      try {
        await adminProductsApi.delete(`/${id}`);
        navigate("/admin/product");
      } catch (err) {
        console.error(err.response?.data || err);
        alert("Gagal menghapus produk. Cek console.");
      } finally {
        setLoading(false);
      }
    }}
    className="px-8 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow-md transition"
    disabled={loading}
  >
    Hapus
  </button>
)}
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-[#F2994A] hover:bg-orange-500 text-white font-bold shadow-md transition disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
