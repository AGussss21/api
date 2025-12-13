import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [storeLocation, setStoreLocation] = useState({ lat: -6.2, lng: 106.816666 }); // default Jakarta
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    instagram: "",
    facebook: "",
    hours: "",
    lat: -6.2,
    lng: 106.816666
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/business-info")
      .then(res => res.json())
      .then(data => {
        const lat = data.lat ?? -6.2;
        const lng = data.lng ?? 106.816666;
        setBusinessInfo({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          email: data.email || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          hours: data.hours || "",
          lat,
          lng
        });
        setStoreLocation({ lat, lng }); // update map otomatis
      })
      .catch(console.error);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Mohon isi semua field sebelum mengirim.');
      return;
    }
    alert('Pesan terkirim. Terima kasih — kami akan menghubungi Anda segera.');
    setName('');
    setEmail('');
    setMessage('');
  }

  // Contact items dari businessInfo
  const contactItems = [
    { icon: <MapPin className="w-5 h-5" />, title: "Meet Us In Office", desc: businessInfo.address || "-" },
    { icon: <Mail className="w-5 h-5" />, title: "Our Email Address", desc: businessInfo.email || "-" },
    { icon: <Phone className="w-5 h-5" />, title: "Meet Us Number", desc: businessInfo.phone || "-" }
  ];

  return (
    <div className="contact-page">
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
              Hubungi Kami
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-1">
              Kami Siap Membantu Anda
            </h1>
          </div>
        </div>
      </motion.section>

      {/* FORM + MAP */}
      <main className="max-w-6xl mx-auto px-4 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <div className="bg-white/95 border border-white rounded-xl mx-6">
              <p className="text-sm text-gray-600 mb-4">
                Alamat Email Anda Tidak Akan Dipublikasikan. Bidang Yang Diperlukan Ditandai.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm">Your Name</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-white bg-yellow-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Your Email</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-xl border border-white bg-yellow-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Your Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm">Questions</label>
                    <textarea
                      rows={8}
                      className="mt-1 w-full rounded-xl border border-white bg-yellow-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Tulis pesan atau pertanyaanmu di sini..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 text-right">
                    <button className="rounded-full px-5 py-2 text-white shadow bg-orange-400 hover:bg-orange-500 transition">
                      Send A Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* MAP */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-black/10 rounded-xl">
              <iframe
                width="100%"
                height="420"
                className="rounded-xl"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${storeLocation.lat},${storeLocation.lng}&z=17&output=embed`}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
          {contactItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="shrink-0 w-11 h-11 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1">
                <div>{item.title}</div>
                <div className="text-sm text-gray-500" style={{ whiteSpace: 'pre-line' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe banner */}
        <div className="relative my-16 rounded-xl text-white text-center min-h-[500px] flex flex-col justify-center overflow-hidden">
          <img
            src="src/assets/Contact/subscribe.png"
            alt="Subscribe background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 px-24">
            <div className="text-orange-500 mb-4 italic text-2xl font-pacifico">
              Mulai Sekarang
            </div>
            <h3 className="text-5xl font-bold">Banyak Pelanggan Bahagia Telah Menikmati Lola Cake</h3>
            <p className="text-lg mt-2">Masukkan email kamu untuk mendapatkan promo dan update menu terbaru.</p>

            <div className="flex justify-center mt-8">
              <div className="relative w-full max-w-sm">
                <input
                  className="w-full h-12 rounded-full px-4 py-2 pr-28 text-black placeholder-gray-500 bg-white/90"
                  placeholder="Enter Your Email Address"
                />
                <button className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-5 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-500 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
