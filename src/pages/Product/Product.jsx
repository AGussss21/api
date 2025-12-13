import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/ui/SearchBar.jsx";
import { motion } from "framer-motion";

const products = [
  {
    img: "src/assets/Product/satuan.png",
    alt: "item",
    title: "Cocok untuk camilan harian dan hadiah kecil.",
    // desc: "Jelajahi pilihan kue dan paket Lola Cake yang dibuat dari bahan segar dan citarasa rumahan.",
    link: "/product/satuan",
    linkText: "Pilih Item Satuan",
  },
  {
    img: "src/assets/Product/paketan.png",
    alt: "paket",
    title: "Ideal untuk acara spesial, hampers, dan pesanan besar.",
    // desc: "Pilih paket yang sesuai kebutuhan acara atau buat hampers personal untuk orang tersayang.",
    link: "/product/paketan",
    linkText: "Pilih Paketan",
  },
];

export default function Product() {
  return (
    <div className="product-page">
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

      {/* Title & Desc */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold text-[#3d231d]"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Temukan Beragam Pilihan Lezat dari Lola Cake!
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Pilih produk satuan untuk pembelian per item, atau produk paketan untuk acara dan hampers spesialmu.
          </motion.p>
        </div>
      </section>

      {/* Kategori */}
      <section className="relative mb-20">
        <img src="src/assets/Product/left.svg" alt="Left icon"
          className="hidden md:block absolute left-0 top-1/3 w-[300px] h-[500px] -z-10"
        />
        <img src="src/assets/Product/right.svg" alt="Right icon"
          className="hidden md:block absolute right-0 top-1/3 w-[300px] h-[500px] -z-10"
        />
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="rounded-xl p-8 bg-white border-4 border-[rgba(61,35,29,0.12)] shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col items-center text-center"
              >
                <motion.img
                  src={card.img}
                  alt={card.alt}
                  initial={{ scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="w-full h-48 object-contain rounded-md mb-4 bg-white"
                />
                <h5 className="font-semibold text-lg text-[#3d231d]">
                  {card.title}
                </h5>
                {/* <p className="mt-2 text-sm text-slate-600">{card.desc}</p> */}
                <Link
                  to={card.link}
                    className="min-w-[160px] mt-4 px-4 py-2 rounded-md text-white bg-[#f08b2d] hover:brightness-105 text-center"              >
                  {card.linkText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
