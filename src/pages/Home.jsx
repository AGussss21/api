import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import boluzebra from '../assets/homepage/bestSeller/boluzebra.png';
import brownies from '../assets/homepage/bestSeller/brownies.png';
import tumpeng from '../assets/homepage/bestSeller/tumpeng.png';
import risoles from '../assets/homepage/bestSeller/risoles.png';
import rotikeju from '../assets/homepage/bestSeller/rotikeju.png';
import Item1 from '../assets/homepage/followUs/Item1.png';
import Item2 from '../assets/homepage/followUs/Item2.png';
import Item3 from '../assets/homepage/followUs/Item3.png';
import Item4 from '../assets/homepage/followUs/Item4.png';

export default function Home() {
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    instagram: '',
    facebook: '',
    opening_hours: ''
  });

    useEffect(() => {
    fetch('http://localhost:5000/api/business-info')
      .then(res => res.json())
      .then(data => {
        setBusinessInfo({
          name: data.name,
          phone: data.phone,
          address: data.address,
          email: data.email,
          instagram: data.instagram,
          facebook: data.facebook,
          hours: data.hours
        });
      })
      .catch(err => console.error('Failed to load business info', err));
  }, []);


  const products = [
    {
      id: 'brownies',
      name: 'Brownies',
      price: 'Rp. 60.000',
      img: brownies,
      features: [
        'Tekstur lembut & fudgy',
        'Rasa coklat pekat',
        'Topping kacang pilihan',
        'Dibuat dari bahan premium'
      ],
      links: '/product/satuan/brownies'
    },
    {
      id: 'bolu-zebra',
      name: 'Bolu Zebra',
      price: 'Rp. 75.000',
      img: boluzebra,
      features: [
        'Pola zebra unik coklat & vanila',
        'Aroma wangi khas bolu',
        'Tekstur halus & lembut',
        'Cocok untuk suguhan acara'
      ],
      links: '/product/satuan/bolu-zebra'
    },
    {
      id: 'tumpeng',
      name: 'Tumpeng',
      price: 'Rp. 20.000',
      img: tumpeng,
      features: [
        'Mini tumpeng praktis',
        'Isian lauk gurih lengkap',
        'Tampilan tradisional meriah',
        'Pas untuk acara keluarga'
      ],
      links: '/product/paketan/tumpeng'
    },
    {
      id: 'risoles',
      name: 'Risoles',
      price: 'Rp. 12.000',
      img: risoles,
      features: [
        'Isi sayur & ayam lezat',
        'Kulit tipis digoreng garing',
        'Camilan serbaguna untuk acara',
        'Disajikan hangat & renyah'
      ],
      links: '/product/satuan/risoles'
    },
    {
      id: 'roti-keju',
      name: 'Roti Keju',
      price: 'Rp. 30.000',
      img: rotikeju,
      features: [
        'Roti lembut isi keju melimpah',
        'Rasa gurih & manis seimbang',
        'Cocok untuk sarapan atau snack',
        'Dipanggang segar setiap hari'
      ],
      links: '/product/satuan/roti-keju'
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: "Pemesanan super mudah, pelayanan ramah, dan kue sampai hangat. Rasanya lembut dan porsinya pas — kami pesan untuk acara keluarga, semua tamu puji!",
      name: "Rina Putri",
      role: "Event Organizer",
      rating: 4.9,
      stars: "★★★★★",
      avatar: "/assets/user1.jpg"
    },
    {
      id: 2,
      text: "Packaging rapih, rasa autentik, dan delivery cepat. Sangat puas! Akan repeat order untuk catering kantor. Recommended banget.",
      name: "Dimas Arief",
      role: "Corporate Client",
      rating: 5.0,
      stars: "★★★★★",
      avatar: "/assets/user2.jpg"
    }
  ];

  const images = [Item1, Item2, Item3, Item4];

  const [activeId, setActiveId] = useState(products[0].id);
  const activeProduct = products.find((p) => p.id === activeId) || products[0];

  return (
    <div className="font-sans">
      {/* HERO */}
      <motion.header className="relative py-32 pb-20 flex items-center overflow-visible bg-[#3d231d] py-20 text-white"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="absolute right-0 top-0 h-full w-[30%] bg-white [clip-path:polygon(0_0,100%_0,100%_100%,50%_100%)] z-[1]" />

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <motion.div className="space-y-4" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                <span className="text-[#ffd08a]">Kue Lezat,</span> Langsung dari Oven untuk Anda!
              </h1>
              <p className="mt-3 max-w-xl text-lg text-[#f1d9b8]">
                Lifestyle Bakery Dengan Varian Produk Terbanyak dan Jaminan Kualitas Produk & Layanan.
              </p>
              <Link to="/product" className="mt-4 rounded-lg border-2 border-[#ffd08a] px-5 py-2 text-sm font-medium text-[#ffd08a] bg-transparent hover:bg-[#ffd08a]/10 transition">
                Pesan Sekarang
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.img
          src="src/assets/homepage/hero.png"
          alt="roll"
          className="hidden lg:block absolute right-0 top-5 z-[2] w-[40%]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </motion.header>

      {/* BEST SELLER SECTION */}
      <motion.section
        className="bg-white pt-30 py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-6xl px-4">
          {/* HEADER */}
          <div className="mb-6 lg:text-left">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Favorit Sepanjang Waktu
            </div>
            <h2 className="mt-1 text-2xl font-bold text-[#3d231d] font-federokaone">
              Best Seller
            </h2>
          </div>

          {/* CONTENT */}
          <div className="relative overflow-visible">
            <div className="grid items-center gap-4"
              style={{ gridTemplateColumns: '1fr auto 1fr' }}
            >
              {/* LEFT LIST*/}
              <div className="z-10 flex"> 
                <div className="w-full"> {/* max-w-[320px] */}
                  <div className="space-y-1 rounded-2xl bg-[#3d231d] p-7 shadow-xl">
                    {products.map((p) => {
                      const isActive = p.id === activeId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setActiveId(p.id)}
                          aria-pressed={isActive}
                          className={`flex w-full items-center gap-3 rounded-full px-6 py-6 text-[15px] font-medium transition
                          ${isActive ? 'bg-[#f08b2d] text-white' : 'bg-white text-[#3d231d]'}`}
                          style={{ letterSpacing: '0.2px' }}
                        >
                          <span
                            className={`flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full border-[2.5px]
                            ${isActive ? 'border-[#3d231d]' : 'border-gray-300 bg-transparent'}`}
                            aria-hidden
                          >
                            <span
                              className={`block h-2 w-2 rounded-full
                              ${isActive ? 'bg-[#3d231d]' : 'bg-transparent'}`}
                            />
                          </span>

                          <span className="flex-1 text-left leading-tight">
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="z-0" />

              {/* RIGHT CARD */}
              <div className="z-10 flex ml-10 lg:ml-10">
                <div className="w-full"> 
                  <div className="relative">
                    <div className="space-y-4 rounded-[18px] border-4 border-[#f08b2d] bg-white p-3 pl-35 py-12 shadow-sm">
                      <h4 className="text-2xl font-semibold text-[#3d231d]">
                        {activeProduct.name}
                      </h4>

                      <div className="mb-6">
                        <ul className="grid grid-cols-2 gap-3 text-md text-gray-800">
                          {activeProduct.features.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-0.5 text-sm text-green-900" aria-hidden>
                                ✓
                              </span>
                              <span className="leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-2xl font-bold text-red-500">
                        {activeProduct.price}
                      </p>
                    </div>

                    {/* Button */}
                    <div className="absolute left-1/2 bottom-[-22px] z-30 -translate-x-1/2">
                      <div className="relative inline-block">
                        <div
                          className="absolute inset-x-0 -inset-y-1.5 z-10 pointer-events-none rounded-lg border-2 border-[#3d231d] bg-[#fff] shadow-lg
                                    translate-x-2"
                          aria-hidden="true"
                        />
                        <Link
                          to={activeProduct.links || '#'}
                          className="relative z-20 inline-flex items-center rounded-md bg-[#3d231d] px-6 py-2 text-sm font-medium text-white shadow-lg hover:brightness-105"
                        >
                          Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE IMAGE */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 400, height: 'auto', maxWidth: '80vw' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeProduct.id}
                  src={activeProduct.img}
                  alt={activeProduct.name}
                  className="w-full h-auto object-contain"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* WHY CHOOSE US */}
      <motion.section
        className="bg-white py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center">
            <div>
              <h6 className="text-sm font-medium text-gray-500">
                Mengapa Memilih Kami?
              </h6>
              <h3 className="mt-1 text-2xl font-extrabold text-[#3d231d] md:text-3xl">
                Kualitas Premium, Rasa Yang Bikin Senyum
              </h3>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Kami menghadirkan kue premium buatan tangan yang lembut, nikmat, dan dibuat dengan perhatian pada setiap detail.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="flex items-start gap-3 rounded-[12px] p-[18px]"> {/* bg-[#f4efe8] */}
                    <img src="/assets/bread.png" alt="Kue Segar" className="h-10 w-10"/>
                    <div>
                      <h6 className="font-semibold text-[#3d231d]">
                        Kue Segar Setiap Hari
                      </h6>
                      <small className="text-xs text-gray-600">
                        Kami memanggang setiap kue dengan bahan segar pilihan dan resep khas Lola Cake.
                      </small>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3 rounded-[12px] p-[18px]">
                    <img src="/assets/handmade.png" alt="Handmade" className="h-10 w-10" />
                    <div>
                      <h6 className="font-semibold text-[#3d231d]">
                        Rasa Premium Handmade
                      </h6>
                      <small className="text-xs text-gray-600">
                        Setiap potongan kue dibuat dengan tangan penuh cinta, bukan dari pabrik.
                      </small>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3 rounded-[12px] p-[18px]">
                    <img src="/assets/trophy.png" alt="Dipercaya" className="h-10 w-10"/>
                    <div>
                      <h6 className="font-semibold text-[#3d231d]">
                        Dipercaya Banyak Pelanggan
                      </h6>
                      <small className="text-xs text-gray-600">
                        Ratusan pelanggan telah jatuh cinta pada kelezatan Lola Cake.
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Link to="/about-us"
                  className="inline-flex items-center rounded-md bg-[#f08b2d] px-5 py-2 text-sm font-medium text-white hover:brightness-105"
                >
                  More About Us
                </Link>
                <div>
                  <h6 className="mb-0 text-sm font-semibold text-[#3d231d]">
                    Team Lola Cake
                  </h6>
                  <small className="text-xs text-gray-500">
                    Kepuasan Dan Senyum Pelanggan Adalah Kebahagiaan Terbesar Kami
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        className="bg-gradient-to-b from-white to-white py-16 pb-30"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-center text-2xl font-extrabold text-[#3d231d] md:text-3xl">
            Apa Kata Mereka?
          </h3>
          <p className="mt-1 text-center text-sm text-gray-600 md:text-base">
            Cerita manis dari pelanggan yang jatuh cinta pada rasa Lola Cake.
          </p>

          <div className="mt-8 grid justify-center gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.id} className="flex justify-center">
                <div className={`relative max-w-lg rounded-[20px] bg-[#ffe7a3] px-8 pt-8 pb-12 shadow-[0_8px_30px_rgba(0,0,0,0.08)]`}>                  
                  <div className="absolute -right-4 -top-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f08b2d] text-4xl font-bold text-white shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                    “
                  </div>

                  <p className="mt-1 text-lg leading-relaxed text-[#5c4327]">
                    “{t.text}”
                  </p>

                  <hr className="my-4 border-t border-black/10" />

                  <div className="flex items-end gap-4">
                    <div>
                      <div className="text-base font-semibold text-[#4a2e1b]">
                        {t.name}
                      </div>
                      <div className="text-[12px] uppercase tracking-[0.04em] text-[#e17b1c]">
                        {t.role}
                      </div>
                    </div>

                    <div className="ml-auto text-right">
                      <div className="text-[12px] text-gray-500">Ratings &amp; Reviews</div>
                      <div className="text-[26px] font-bold leading-none text-[#4a2e1b]">
                        {t.rating}
                      </div>
                      <div className="text-[15px] text-[#f4b000]">{t.stars}</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 left-8 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW WE WORK */}
      <motion.section
        className="relative overflow-visible bg-[#f08b2d] py-16 text-[#3d231d]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-6xl px-6 my-10">
          <div className="grid items-center lg:grid-cols-[4fr_2fr]">
            {/* LEFT: header + 3 steps */}
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fff3d6]">
                PESAN DI LOLA CAKE HANYA 3 LANGKAH
              </div>

              <h2 className="mb-6 text-4xl font-extrabold leading-tight text-[#4a2e1b] md:text-5xl">
                Cara Kami Bekerja
              </h2>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                {[
                  {
                    id: 1,
                    title: 'Lihat Product',
                    text: 'Jelajahi pilihan kue dan paket Lola Cake yang dibuat dari bahan segar dan cita rasa rumahan.',
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#000" strokeWidth="1.5" />
                        <line x1="7" y1="9" x2="17" y2="9" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="7" y1="13" x2="17" y2="13" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )
                  },
                  {
                    id: 2,
                    title: 'Pilih Pesanan',
                    text: 'Tentukan varian, ukuran, dan jenis kue sesuai seleramu.',
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13c0 1.657 3.134 3 7 3s7-1.343 7-3" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M5 13c1.5-3 6-3 8 0" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="12" cy="9" r="1.2" fill="#000"/>
                      </svg>
                    )
                  },
                  {
                    id: 3,
                    title: 'Pesan & Nikmati',
                    text: 'Pesan lewat WhatsApp atau website, lalu tunggu pesanan lezatmu diantar ke rumah atau ambil langsung!',
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="6.5" width="13" height="6" rx="1" stroke="#000" strokeWidth="1.5"/>
                        <path d="M15 9.5h4l2 2v3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="7" cy="16.2" r="1.6" stroke="#000" strokeWidth="1.5"/>
                        <circle cx="19" cy="16.2" r="1.6" stroke="#000" strokeWidth="1.5"/>
                      </svg>
                    )
                  }
                ].map((s) => (
                  <div key={s.id} className="flex items-start gap-4 md:flex-col md:items-start md:gap-3"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#ffdc38] shadow-[0_10px_18px_rgba(0,0,0,0.14)]">
                        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[#000] bg-[#ffdc38]">
                          <div className="text-black">{s.icon}</div>
                        </div>
                      </div>

                      <div className="absolute -top-0 -left-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#000] text-sm font-bold text-white">
                        {s.id}
                      </div>
                    </div>

                    <div className="max-w-xs md:text-left">
                      <h5 className="mb-2 text-lg font-extrabold text-[#4a2e1b]">{s.title}</h5>
                      <p className="text-sm text-white text-[#3f2b16]">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            

            {/* RIGHT */}
            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="hidden md:block absolute left-0 top-35 -translate-y-1/2 -translate-x-8" aria-hidden>
                  <svg width="190" height="169" viewBox="0 0 190 169" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="157" height="120" transform="translate(43.6673) rotate(21.3395)" fill="url(#pattern0_710_4245)"/>
                    <defs>
                      <pattern id="pattern0_710_4245" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image0_710_4245" transform="scale(0.00636943 0.00833333)"/>
                      </pattern>
                      <image id="image0_710_4245" width="157" height="120" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAAB4CAMAAADfcQDVAAAAk1BMVEUAAAD/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A3/1A205XiVAAAAMHRSTlMACgYUEA0cLionzGM+MyDlehn79uzbn9/AiUjUtpmR8aumal5ZxbtONyOAblRzOrCUF5UmAAAEg0lEQVR42u3cZ5OiQBAG4HfIOUdBMGfd/v+/7tS7q8sLg+hOXe1TftEqirbtiYD4Tp1tIazdjPwJBLWriSgWMzzJtOgmFzK8yYa+8h0Ix7Ei+ibXIZhLTj9YLkTClj79LNUgECPINpusTouNnxZpbOWVAYHIEpQQkhHC0Jm3M/chPn16EcnRhWqsv5nSEuISO7osCiCu7UmoXvjTJwFo07MMYckUCzw52aexCXFtaAVxTf0FxOWuFHz69HpKiBdRmKyHkMDBmU1VPJuEm4tVWe2bBoD1PjAiDU/m2Bmu9DjJo/p2tknVuOhlFh3xTNJp7lO7x9XecWXjlscFUVIvGbrZNGd4ItmndLY18Qt96tMhRDcznyt4ImlS6gx/MJYm+tA1CU9idLUUeY+PIp2srpPbbRbiQ7CFH5WdRU8Z6+6PnuDo08FDByeljYr3sEtpYHTSNTh026YdyZPm0QLj2x3Rh9zVdpdRxcDvVfViCb3ZY7eFhDHtwEM+nPEO1XYxJtnnKhXjpStDJSBLBYeGSrzM1k9W4OHGbUefpjKMJYiaEDzYvKNZKs14c2RnaoCPq5vvR5fQEeKakC/chdCfzGkGcWmbUsbjpFDGAI7CMZMdzrQaFdzcdI1XWFHFhlR9IaOTikctaAp+epJ76CKXAR5U0An8XEoYuniUrPAYa60OiS5fo9uZfBcPkQcdr0LrN11IBd7nlucHFQITOrjHSLcXP4WrWM86htGSjIHfiWeMt2mtYZALpRjgjQKODBRUDcueTRn4SW3Ekw1jTYWCAc40ZUPGZgs85GrY3sqpDcBP33AepTEM4u4xhPTfdX3nWuQbQtZUuHg2yVQxiFdQVIKHoofgtI0yDOOVyQw83IJ3rDAsKjGUvuNcH1jcC9Vaw0NCr3cmksrkHPr8LR4iHaqjjF5YTjrnfDJgeMwhjuf9UqJmqYwXUxY55b3CY0zB6+lZE2Js6pZhJAxXmobxsCxZjbsk2iwUjGQ3pXzU6JQ6imeTjoycHIYelIKqFUa1X1hdk3o1JbPfN7UuGJt5WKoA5H+HWPcdmUw8SzkPNBV/5VBidsw0jxKeSZlFURHI+KuClu+mbJWTg2eSdoua/rXjtg/2+Dd7Q1TYeLLQXjEA+nni7Rn6c5LW1vEiR6KqPqp9evPtRLknT5HwKm5p5e2B3ZKy8zwP32m/LreUSWO1pOPllMvJwNUbJcXm3lV7ste84UZjl9PqFiiziNa1hg9zTNMkvpd7SSlRA0ANyCe6f7YMtiE+lLld3SurobiK47MEVtK6ftt9qztBKMxxAmoNQPWMW+EJh51LCIwJ81P+jVjF9jfqdOpBWF5MM4H3iZw1kcA30uuZ0DcxYacCQvZ5P4Q2xCUdqdiK27ssWiJLyP8luJMXVSzWg/W/8nTp3kggMJfWR3EfKD5FRDSFqNhpFh9wtfdkMVuxjKtNUgcLYe8Lq3Micu7BKqF4l7xMO2vuWVxXs+khBEQb8WTc+G1EiXZ7m82DZilSgFeKY5/te7B0ZYn6yKw0sZvAFq8Gf2DAF1asV08AjyJDAAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </div>

                <div className="absolute left-8 top-4 flex items-center gap-3 pointer-events-auto">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f6926] text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15.46v3a2 2 0 0 1-2.18 2c-9.2-.95-16.73-8.49-17.68-17.68A2 2 0 0 1 6.54 2h3a1 1 0 0 1 1 .78c.2 1.1.7 2.73 1.9 4.15a1 1 0 0 1-.24 1.33l-1.2.99a11 11 0 0 0 4.9 4.9l.98-1.2a1 1 0 0 1 1.33-.24c1.42 1.2 3.05 1.7 4.15 1.9a1 1 0 0 1 .78 1z"
                        stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="text-left hidden sm:block">
                    <div className="text-[12px] uppercase text-white/90">
                      How to Order?
                    </div>
                    <div className="text-sm font-bold text-white tracking-[0.06em]">
                      CALL US: {businessInfo.phone }
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-16">
                <img
                  src="src/assets/homepage/how.png"
                  alt="Brownies Lola Cake"
                  className="mx-auto block w-[320px] md:w-[420px] object-cover drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOLLOW / GALLERY */}
      <motion.section className="relative bg-white py-16 pb-20 overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-6xl px-4 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, delay: 0.1 }}
            className="mb-4 flex h-16 w-16 items-center justify-center mx-auto rounded-full bg-[#f08b2d] text-2xl text-white sm:h-[64px] sm:w-[64px] sm:text-[26px]"
          >
            <i className="bi bi-instagram" />
          </motion.div>

          <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-[28px] font-bold text-[#3d231d]">
            Follow <span className="text-[#f08b2d]">Lola Cake</span>
          </motion.h4>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-1 text-[13px] text-gray-500">
            Join our Instagram community for updates, special deals, and more
          </motion.p>

          <div className="mt-6 grid grid-cols-2 justify-center gap-3 sm:grid-cols-4">
            <div className="absolute -translate-y-[30px] -left-6 hidden h-[88px] w-[88px] rounded-full bg-[#f08b2d] z-0 md:block" />
            <div className="absolute -bottom-6 -right-6 hidden h-[88px] w-[88px] rounded-full bg-[#4a2e1b] z-0 md:block" />

            {images.map((src, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + idx * 0.12 }} 
                className="relative z-10 overflow-hidden rounded-[18px] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={src}
                  alt={`Lola Cake gallery ${idx + 1}`}
                  className="h-[320px] w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}