import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../lib/slugify";
import { ShoppingCart, ChevronDown } from "lucide-react";
import SearchBar from "../../components/ui/SearchBar.jsx";
import { motion } from "framer-motion";
import allIcon from "../../assets/Product/Paketan/Kategori/kue.png";
import cakeIcon from "../../assets/Product/Paketan/Kategori/kue.png";
import foodIcon from "../../assets/Product/Paketan/Kategori/makanan.png";
import drinkIcon from "../../assets/Product/Paketan/Kategori/minuman.png";
import { products } from "../../data.js";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}
const isPaketan = (p) => String(p.id).startsWith("p-");

const ICON_MAP = {
  kue: cakeIcon,
  makanan: foodIcon,
  minuman: drinkIcon,
};

export default function ProductPaket() {
  // TODO: fetch products dari API

  // derive categories dari data.js: hanya kategori produk "paketan"
  const categories = useMemo(() => {
    const set = new Map();
    products.forEach((p) => {
      if (!isPaketan(p)) return;
      const keyRaw = (p.category || "Uncategorized").trim();
      const id = keyRaw.toLowerCase().replace(/\s+/g, "-");
      if (!set.has(id)) {
        set.set(id, {
          id,
          label: keyRaw,
          icon: ICON_MAP[id],
        });
      }
    });
    return [{ id: "all", label: "All", icon: allIcon }, ...Array.from(set.values())];
  }, []);

  const categoryDescriptions = {
    all: "Koleksi lengkap paket Lola Cake — berisi aneka kue, makanan, dan minuman. Cocok untuk acara keluarga, pesta, atau sekadar memanjakan diri dengan berbagai varian lezat sekaligus.",
    kue: "Aneka kue tradisional dan modern pilihan, tersaji rapi dalam tampah cantik. Pas untuk arisan, rapat, atau sekadar suguhan manis yang estetik dan siap saji.",
    makanan: "Paket makanan lengkap dengan cita rasa khas, tersusun higienis dan menarik. Ideal untuk jamuan keluarga, acara kantor, atau hidangan praktis yang tetap elegan.",
    minuman: "Beragam minuman segar dalam satu set praktis, dari teh hingga minuman manis favorit. Cocok menemani hidangan di acara keluarga, arisan, maupun rapat dengan tampilan estetik."
  };

  // UI state
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "all");
  const [appliedSort, setAppliedSort] = useState("default");
  const [appliedMin] = useState(3000);
  const [appliedMax, setAppliedMax] = useState(500000);
  const [tempMax, setTempMax] = useState(appliedMax);
  const [openPrice, setOpenPrice] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [query, setQuery] = useState("");
  const sortRef = useRef(null);
  const priceRef = useRef(null);

  // Filter & sort products (non-mutating)
  const filteredProducts = useMemo(() => {
    let list = products.filter(isPaketan);
    if (activeCategory && activeCategory !== "all") {
      list = list.filter((p) => {
        const id = (p.category || "").toLowerCase().replace(/\s+/g, "-");
        return id === activeCategory;
      });
    }
    const q = (query || "").trim().toLowerCase();
    if (q) {
      list = list.filter((p) => (p.nama || p.title || "").toLowerCase().includes(q));
    }
    list = list.filter((p) => Number(p.price) >= appliedMin && Number(p.price) <= appliedMax);

    // urutkan
    switch (appliedSort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "top":
        list = [...list].sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      default:
        list = list;
    }

    return list;
  }, [products, activeCategory, query, appliedMax, appliedMin, appliedSort]);

  const SORT_OPTIONS = [
    { value: "default", label: "Urutkan Berdasarkan" },
    { value: "price-asc", label: "Harga Terendah" },
    { value: "price-desc", label: "Harga Tertinggi" },
    { value: "newest", label: "Terbaru" },
    { value: "top", label: "Terlaris" },
  ];

  function applyFilters() {
    setAppliedMax(Number(tempMax));
    setOpenPrice(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    }
    if (openSort) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSort]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setOpenPrice(false);
      }
    }
    if (openPrice) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPrice]);


  function addToCart(p) {
    const u = readUser();
    if (!u) {
      window.location.href = "/login";
      return;
    }
    const key = "user_cart";
    const raw = localStorage.getItem(key);
    const cart = raw ? JSON.parse(raw) : [];
    const idx = cart.findIndex((i) => i.id === p.id);
    if (idx >= 0) cart[idx].qty = (cart[idx].qty || 1) + 1;
    else cart.push({ id: p.id, name: p.nama || p.title, price: p.price, qty: 1 });
    localStorage.setItem(key, JSON.stringify(cart));
    try {
      window.dispatchEvent(new Event("cart-changed"));
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-150 flex items-center justify-center">
        <img src="/src/assets/Product/banner.png" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(61,35,29,0.55)] to-[rgba(61,35,29,0.55)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <motion.h1
            className="mx-auto max-w-3xl font-extrabold text-2xl md:text-4xl leading-tight text-white"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Temukan aneka kue dan hidangan spesial dari Lola Cake — dibuat dengan bahan berkualitas, rasa rumahan, dan cinta dari dapur kami!
          </motion.h1>

          <motion.div
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="shadow-2xl rounded-full max-w-[760px] mx-auto">
              <SearchBar
                placeholder="Temukan produk favoritmu di sini..."
                description=""
                from="product-hero"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3 px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              className={`inline-flex flex-col items-center gap-2 px-2 py-3 min-w-[90px] rounded-lg transition-transform ${
                activeCategory === cat.id
                  ? "bg-[#f08b2d] text-white -translate-y-1.5 shadow-lg"
                  : "bg-white text-slate-700 border border-slate-300 shadow-sm"
              }`}
            >
              <motion.img src={cat.icon} alt={cat.label}
                className="w-12 h-12 object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              />
              <span className="text-sm font-medium">{cat.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="text-center mt-8 max-w-xl mx-auto leading-relaxed">
          <nav className="text-sm text-slate-600 mb-3">
            <Link to="/" className="hover:underline">Home</Link> &nbsp;&gt;&nbsp;
            <Link to="/product" className="hover:underline">Product</Link> &nbsp;&gt;&nbsp;
          </nav>
          <motion.h3 className="text-3xl font-extrabold text-[#3d231d]"
            initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            Koleksi {categories.find(c => c.id === activeCategory)?.label || "Produk"}
          </motion.h3>
          <motion.p className="text-sm text-slate-600 mt-3 mb-6"
            initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
          >
            {categoryDescriptions[activeCategory] || "Koleksi produk satuan Lola Cake dibuat segar dengan bahan pilihan terbaik."}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3" ref={priceRef}>
            <div className="relative">
              <button onClick={() => setOpenPrice(v => !v)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm flex items-center gap-2 w-50"
              >
                Rentang Harga
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none transition-transform ${openPrice ? "rotate-180" : ""}`}/>
              </button>

              {openPrice && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-20">
                  <div className="flex justify-between text-sm text-slate-700 mb-2">
                    <span className="text-slate-500">Rp3.000</span>
                    <span className="text-slate-500">Rp500.000</span>
                  </div>
                  <input type="range" min={3000} max={500000} step={1000} value={tempMax}
                    onChange={(e) => setTempMax(Number(e.target.value))} className="w-full accent-orange-400"
                  />
                  <div className="mt-2 text-sm text-slate-700">
                    Rp{Number(tempMax).toLocaleString()}
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <button onClick={() => { setTempMax(500000); setAppliedMax(500000); setOpenPrice(false); }} className="px-3 py-1 rounded border text-sm">
                      Reset
                    </button>
                    <button onClick={applyFilters} className="px-3 py-1 rounded bg-[#f08b2d] text-white text-sm">
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative w-50" ref={sortRef}>
            <button onClick={() => setOpenSort(v => !v)} aria-expanded={openSort}
              className="w-full text-left rounded-lg border border-slate-200 px-3 py-2 bg-white flex items-center justify-between text-sm"
            >
              {SORT_OPTIONS.find(o => o.value === appliedSort)?.label || "Urutkan Berdasarkan"}
              <ChevronDown className={`w-4 h-4 transition-transform ${openSort ? "rotate-180" : ""}`} />
            </button>

            {openSort && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg z-20">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => {
                      setAppliedSort(opt.value);
                      setOpenSort(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${appliedSort === opt.value ? "font-semibold" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {filteredProducts.length === 0 ? (
            <motion.div className="col-span-full text-center py-12 text-slate-600"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}
            >
              Produk belum tersedia untuk saat ini.
            </motion.div>
          ) : (
            filteredProducts.map((p) => {
              const slug = `${slugify(p.nama || p.title)}`;
              return (
                <motion.div key={p.id} className="border border-slate-300 rounded-xl p-2 bg-white flex flex-col justify-between text-center shadow-md"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                >
                  <div>
                    <img src={p.img} alt={p.nama || p.title}
                      className="mx-auto rounded-md object-contain w-full h-40 bg-white"
                    />
                    <div className="mt-3 font-semibold">{p.nama || p.title}</div>
                    <div className="text-sm text-slate-500">
                      Rp {Number(p.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 p-4 justify-center">
                    <motion.button onClick={() => addToCart(p)}
                      className="flex-0 border border-orange-400 rounded-md px-3 py-2 hover:bg-orange-50"
                      title="Tambah ke keranjang" whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-4 h-5 text-slate-700" />
                    </motion.button>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Link to={`/product/paketan/${slug}`}
                        className="block text-center rounded-md px-3 py-2 bg-[#f08b2d] text-white hover:brightness-105"
                      >
                        Detail
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </main>
    </div>
  );
}