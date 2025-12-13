// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo_lolacake from "../../assets/loginpage/logo-lolacake.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // success message
  const [err, setErr] = useState(null); // error message

  const API_ROOT = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!email) {
      setErr("Email wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const url = (API_ROOT || "") + "/auth/request-reset"; // sesuaikan bila route berbeda
      const res = await axios.post(
        url,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      // sukses: tampilkan pesan, lalu navigasi ke halaman verifikasi
      setMsg(res?.data?.message || "Email reset password telah dikirim. Cek inbox email Anda.");
      // beri waktu singkat supaya user lihat pesan (opsional), lalu navigasi
      setTimeout(() => {
        navigate("/auth/verify", { state: { email } });
      }, 1000);
    } catch (error) {
      // ambil pesan error dari response jika ada
      const serverMsg = error?.response?.data?.error || error?.response?.data?.message || error?.message;
      setErr(serverMsg || "Gagal mengirim email reset. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="flex justify-end mb-6 -translate-x-20 top-12 z-20">
        <img src={logo_lolacake} alt="Lola Cake logo" className="w-36" />
      </div>

      <div className="bg-[#fdecb6] mx-auto p-12 p-md-5 rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.08)] max-w-[720px]">
        <h1 className="text-[#8C4A24] mb-5 text-center font-extrabold text-4xl md:text-5xl">Forgot Password?</h1>
        <p className="text-center text-[#5E5E5E] mt-3 mb-8 text-sm md:text-base">
          Please enter your email address to get the verification code
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {err && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded">
              {msg}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">Email*</label>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-sm md:text-base font-semibold tracking-wide transition
              ${!loading ? "bg-[#F29B3D] text-white hover:brightness-105" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
            style={{ background: !loading ? "#f08b2d" : undefined, color: "#fff" }}
          >
            {loading ? "Mengirim..." : "Send Code"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs md:text-sm text-[#5E5E5E]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#F29B3D] font-semibold">
            GET STARTED
          </Link>
        </p>
      </div>
    </div>
  );
}
