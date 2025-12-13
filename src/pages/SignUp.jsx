import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { api } from "../lib/api";
import { parseAuthError } from "../lib/auth-errors";
import logo_lolacake from "../assets/loginpage/logo-lolacake.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    okText: "OK",
    onOk: null,
  });

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name || !form.username || !form.phone || !form.email || !form.password) {
      return showPopup({
        type: "error",
        title: "Form tidak lengkap",
        message: "Semua field wajib diisi.",
        okText: "Periksa",
        onOk: closePopup,
      });
    }

    if (form.password !== form.confirm) {
      return showPopup({
        type: "error",
        title: "Konfirmasi tidak sama",
        message: "Konfirmasi password tidak cocok.",
        okText: "Periksa",
        onOk: closePopup,
      });
    }

    setLoading(true);

    try {
      const res = await api.post("/register", {
        fullname: form.name,
        username: form.username,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      showPopup({
        type: "success",
        title: "Registrasi Berhasil!",
        message:
          res.message ||
          "Akun berhasil dibuat. Silakan cek email untuk verifikasi akun sebelum login.",
        okText: "Ke Halaman Login",
        onOk: () => {
          closePopup();
          navigate("/login");
        },
      });
    } catch (err) {
      const p = parseAuthError(err);
      showPopup({
        ...p,
        okText: p.title === "Email sudah terdaftar" ? "Daftar Ulang" : "Periksa",
        onOk: closePopup,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="flex justify-end mb-6 -translate-x-20 top-12 z-20">
        <img src={logo_lolacake} alt="Lola Cake logo" className="w-36" />
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="mx-auto p-6 md:p-10 max-w-[720px] bg-[#fdecb6] rounded-[24px]">
          <h1 className="text-[#8C4A24] mb-5 text-center font-extrabold text-4xl md:text-5xl">
            Sign Up
          </h1>
          <p className="text-center mt-3 text-xs md:text-sm text-[#5E5E5E]">
            Already have account?{" "}
            <Link to="/login" className="text-[#F29B3D] font-semibold">
              Log in Here
            </Link>
          </p>

          {err && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800">Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="Nama lengkap"
                aria-label="name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800">Username*</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="Username"
                aria-label="username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800">Nomor HP*</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="08xx..."
                aria-label="phone"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800">Email*</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="email@example.com"
                aria-label="email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800">Password*</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="********"
                aria-label="password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-800">Confirm Password*</label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                placeholder="Ulangi password"
                aria-label="confirm-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#F29B3D] text-white rounded-xl py-3 text-sm md:text-base font-semibold tracking-wide hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 transition ${
                loading ? "opacity-60 cursor-not-allowed" : "shadow-md"
              }`}
              style={{ background: "#f08b2d" }}
            >
              {loading ? "Processing..." : "Sign up"}
            </button>
          </form>
        </div>

        <Popup {...popup} />
      </div>
    </div>
  );
}