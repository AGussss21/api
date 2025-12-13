import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, BriefcaseBusiness, Banknote, Truck } from "lucide-react";

export default function AboutUs() {
  const waNumber = "6285241931688";
  const openWhatsApp = () => {
    window.open(`https://wa.me/${waNumber}`, "_blank", "noopener,noreferrer");
  };

const timelineData = [
  {
    year: "2011",
    title: "Awal Manis dari Dapur Rumah",
    desc: "Lola Cake lahir dari kecintaan seorang ibu terhadap dunia baking. Berawal dari dapur kecil di Kendari, kami mulai membuat brownies untuk keluarga dan teman dekat. Siapa sangka, cita rasa lembut dan aroma butter khas Lola Cake membuat banyak orang jatuh cinta — pesanan pun mulai berdatangan."
  },
  {
    year: "2016",
    title: "Kemitraan Pertama dengan Perusahaan Agribisnis",
    desc: "Antusiasme pelanggan yang terus meningkat mendorong Lola Cake untuk tumbuh lebih besar. Dari satu stand, kami berkembang menjadi beberapa titik penjualan di berbagai toko kue. Pada masa ini, kami memperluas variasi produk — kami mulai menerima pesanan untuk acara keluarga, kantor, dan perayaan besar."
  },
  {
    year: "2020",
    title: "Berdirinya Toko Kue Sendiri",
    desc: "Berkat doa dan kerja keras, Lola Cake akhirnya memiliki toko kue sendiri di Kendari! Dari yang dulu berpindah-pindah stand, kini kami berdiri mandiri dengan dapur yang lebih luas, pelayanan yang lebih cepat, dan suasana toko yang nyaman."
  },
  {
    year: "2025",
    title: "Inovasi Digital & Ekspansi Produk",
    desc: "Lola Cake kini melangkah lebih jauh — menghadirkan pemesanan online lewat website dan WhatsApp, serta mulai memperkenalkan desain kue custom digital. Kami terus berinovasi agar pelanggan dapat menikmati layanan yang praktis, cepat, dan tetap penuh kehangatan rumahan."
  }
];


  return ( <div className="about-page">
    {/* HERO */}
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white text-center py-20 md:py-24"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="text-orange-400 italic text-lg md:text-xl font-pacifico">
            Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-1">
            Lola Cake
          </h1>
        </div>
      </div>
    </motion.section>

    {/* MAIN CONTENT */}
    <main className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-14">

        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-6 text-[#4b403a] text-justify"
        >
          <h3 className="text-2xl font-semibold">About Us</h3>
          <p>
            Lola Cake berdiri sejak tahun 2011, berawal dari dapur rumah kecil di Kendari,
            Sulawesi Tenggara. Semua dimulai dari tangan seorang ibu yang gemar membuat
            kue brownies untuk keluarga dan teman dekat. Siapa sangka, dari satu loyang
            brownies, datanglah pesanan demi pesanan hingga menjadi awal mula perjalanan
            bisnis yang penuh cinta dan perjuangan.
            <br/>
            Melihat antusiasme pelanggan yang semakin besar, sang pendiri pun memberanikan
            diri menyewa sebuah stand etalase kecil di toko yang menjual aneka kue basah.
            Dari situ, Lola Cake mulai dikenal banyak orang karena cita rasanya yang lembut,
            bahan berkualitas, dan tampilannya yang menarik.
          </p>

          <p>
            Tidak berhenti di situ, usaha terus berkembang. Stand yang awalnya satu,
            bertambah menjadi beberapa di toko-toko lain. Setiap harinya, aroma butter dan
            cokelat dari dapur Lola Cake menyebar, membawa kehangatan dan kebahagiaan bagi
            pelanggan setia.
            <br/>
            Hingga akhirnya, berkat doa, kerja keras, dan kepercayaan pelanggan, Lola Cake
            kini memiliki toko kue sendiri, tidak lagi menyewa stand seperti dulu. Sebuah
            pencapaian besar yang menjadi simbol dari konsistensi, ketekunan, dan cinta
            terhadap setiap potongan kue yang dibuat.
            <br/>
            Kini, Lola Cake tidak hanya menghadirkan brownies saja, tetapi juga berbagai
            pilihan kue modern, tumpeng, dan hidangan acara lainnya. Semua dibuat dengan
            bahan berkualitas, cita rasa yang khas, dan pelayanan yang hangat—karena bagi
            kami, setiap pesanan bukan sekadar produk, melainkan bentuk cinta dan kebahagiaan
            yang dikirimkan dari dapur ke hati pelanggan.
          </p>

          <h4 className="text-xl font-semibold mt-6">Filosofi Kami</h4>
          <p>
            “Kami percaya setiap kue punya cerita — tentang kerja keras, rasa syukur,
            dan kebahagiaan yang dibagikan.” <br/>
            Lola Cake terus berkomitmen untuk menyajikan
            produk yang bukan hanya lezat, tetapi juga bermakna. Setiap resep dikembangkan
            dengan hati, setiap kemasan dirancang dengan kehangatan, dan setiap pelanggan
            dianggap sebagai bagian dari keluarga besar kami.
          </p>

          <h4 className="text-xl font-semibold mt-6">Nilai Kami</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Cinta & Ketulusan: Setiap kue dibuat dengan penuh perhatian seperti untuk keluarga sendiri.</li>
            <li>Kualitas & Kepercayaan: Kami hanya menggunakan bahan terbaik dan menjaga kebersihan di setiap proses.</li>
            <li>Inovasi & Rasa Lokal: Memadukan cita rasa tradisional Indonesia dengan sentuhan modern.</li>
            <li>Kebahagiaan Pelanggan: Kepuasan pelanggan adalah kebanggaan terbesar kami.</li>
          </ul>
        </motion.div>

        {/* Right sidebar */}
        <aside className="lg:col-span-1 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-yellow-100 rounded-xl border border-none p-10 shadow-inner text-left"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Gambaran Toko
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <CalendarDays className="text-orange-400" size={40} />
                <div className="text-sm text-gray-700">Jam Operasional</div>
                <div className="text-sm font-semibold text-gray-900">Senin-Sabtu:<br/> 08:00-20:00<br/>Minggu:<br/> 09:00-17:00</div>
              </div>
              <div className="space-y-1">
                <BriefcaseBusiness className="text-orange-400" size={40} />
                <div className="text-sm text-gray-700">Alamat</div>
                <div className="text-sm font-semibold text-gray-900">Jl. Sapati No.19, Kendari, Sulawesi Tenggara</div>
              </div>
              <div className="space-y-1">
                <Banknote className="text-orange-400" size={40} />
                <div className="text-sm text-gray-700">Mulai Dari</div>
                <div className="text-sm font-semibold text-gray-800">Rp3.000 - Rp500.000</div>
              </div>
              <div className="space-y-1">
                <Truck className="text-orange-400" size={40} />
                <div className="text-sm text-gray-700">Pengantaran</div>
                <div className="text-sm font-semibold text-gray-900">Delivery & Pick Up</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl shadow-lg overflow-hidden flex justify-center items-center h-110"
            style={{ backgroundImage: "url('src/assets/AboutUs/Aside.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0"></div>
            <div className="relative z-10 text-white text-center px-12 space-y-20">
              <div className="space-y-4">
                <h4 className="font-bold text-base lg:text-xl">Stay Connected with Lola Cake via WhatsApp</h4>
                <p className="text-xs md:text-sm text-gray-200">Yuk ngobrol untuk pesanan, promo, atau menu terbaru!</p>
              </div>
              <button onClick={openWhatsApp} className="w-full bg-orange-500 rounded-md py-2 px-4 text-white font-semibold flex items-center justify-center gap-2">
                Chat Sekarang
              </button>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Sejarah Kami */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="mt-12 space-y-6 max-w-6xl mx-auto px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5>Our History</h5>
            <h2 className="text-3xl font-bold">Sejarah Kami</h2>
          </div>
          <p className="text-gray-600">
            Lola Cake hadir sejak tahun 2011 dengan misi menghadirkan cita rasa manis dan gurih,
            kehangatan dari dapur rumahan ke setiap momen spesial pelanggan.
          </p>
        </div>

        <div className="relative mt-8">
          <div className="absolute top-23 left-0 right-0 h-0.5 bg-gray-200"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative">
            {timelineData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative space-y-3 rounded-lg"
              >
                <div className="text-5xl font-bold text-white font-signika mb-16" style={{ WebkitTextStroke: '1px gray' }}>
                  {item.year}
                </div>

                <div className="absolute top-21 transform -translate-x-1/5 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></div>

                <h6 className="font-semibold mt-6">{item.title}</h6>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  </div>
  );
}
