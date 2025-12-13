import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { slugify } from "../lib/slugify";

export default function ProductCard({ product, addToCart, category = 'satuan' }) { 
  const p = product;
  const slug = `${slugify(p.nama || p.title)}`; 
  const fmtRp = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  return (
    <motion.div 
      key={p.id} 
      className="border border-slate-300 rounded-xl p-2 bg-white flex flex-col justify-between text-center shadow-md"
    >
      <div>
        <img src={p.img} alt={p.nama || p.title}
          className="mx-auto rounded-md object-contain w-full h-30 md:h-40 bg-white"
        />
        <div className="mt-0 md:mt-3 font-semibold">{p.nama || p.title}</div> 
        <div className="text-sm text-slate-500">
          {fmtRp(p.price)}
        </div>
      </div>

      <div className="mt-0 md:mt-4 flex gap-2 p-4 justify-center">
        <motion.button onClick={() => addToCart(p)}
          className="flex-0 border border-orange-400 rounded-md px-3 py-2 hover:bg-orange-50"
          title="Tambah ke keranjang" whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-4 h-5 text-slate-700" />
        </motion.button>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
          <Link to={`/product/${category}/${slug}`} 
            className="block text-center rounded-md px-3 py-2 bg-[#f08b2d] text-white hover:brightness-105"
          >
            Detail
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}