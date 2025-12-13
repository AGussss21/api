import React, { useState, useEffect } from "react";
import logo from "../assets/navbar-brand.png";
import halal from "../assets/halal.png";
import { Leaf, Phone, Mail, MapPin, Send, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { motion } from "framer-motion";

export default function Footer() {
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    instagram: '',
    facebook: '',
    hours: ''
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
          hours: data.hours // atau data.opening_hours sesuai backend
        });
      })
      .catch(err => console.error('Failed to load business info', err));
  }, []);

  return (
    <footer>
      <div className="bg-brand text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-2">
                <img src={logo} alt="Lola Cake Logo" className="h-20 w-40 object-cover" />
              </div>
              <p className="max-w-xs opacity-90">
                Lola Cake adalah usaha rumahan yang memproduksi berbagai jenis
                kue dan makanan tradisional dengan rasa autentik dan bahan
                berkualitas.
              </p>
              <div className="flex items-center mt-3">
                <img src={halal} alt="Halal" className="h-24" />
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${businessInfo.phone || '6285241931688'}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a
                    href={businessInfo.facebook || 'https://facebook.com'}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={businessInfo.instagram || 'https://instagram.com'}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-brand"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div>
              <div className="font-bold text-lg mb-4">Menu</div>
              <ul className="space-y-2">
                {[{ label: "Menu", href: "/" }, { label: "Product", href: "/product" }, { label: "About Us", href: "/about-us" }, { label: "Contact", href: "/contact-us" }, { label: "Profile", href: "/account/profile" }].map(item => (
                  <motion.li
                    key={item.label}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <Leaf size={16} className="shrink-0" />
                    <a href={item.href} className="hover:underline">{item.label}</a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Help Center */}
            <div>
              <div className="font-bold text-lg mb-4">Help Center</div>
              <ul className="space-y-2">
                {[{ label: "FAQ", href: "#" }, { label: "Terms & Conditions", href: "#" }, { label: "Privacy Policy", href: "#" }].map(item => (
                  <motion.li
                    key={item.label}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <Leaf size={16} className="shrink-0" />
                    <a href={item.href} className="hover:underline">{item.label}</a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="font-bold text-lg mb-4">Contact</div>
              <ul className="space-y-2 mb-3">
                <li className="flex items-center gap-2">
                  <Phone size={18} /> {businessInfo.phone || '0852-4193-1688'}
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={18} /> {businessInfo.email || 'lolacake@gmail.com'}
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={18} />
                  <span>{businessInfo.address || 'Jl. Sapati No.19, Kendari, Sulawesi Tenggara'}</span>
                </li>
              </ul>
              <div className="flex items-center overflow-hidden rounded-md bg-white">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  aria-label="Your Email Address"
                  className="flex-1 px-3 text-sm text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-3 bg-coffee text-white flex items-center gap-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-coffee text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 text-center">
          Copyright © 2024 <a href="/" className="underline">Lola Cake</a>, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}