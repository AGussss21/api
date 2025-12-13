import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { api, saveAuth } from "../lib/api";
import { parseAuthError } from "../lib/auth-errors";

import logo_lolacake from "../assets/loginpage/logo-lolacake.png";
import loginhero from "../assets/loginpage/login-hero.png";

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false });

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  useEffect(() => {
    if (state?.justRegistered) {
      showPopup({
        type: "success",
        message: "Akun berhasil dibuat! Silakan login.",
        okText: "OK",
        onOk: closePopup,
      });
    }
  }, [state]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return showPopup({
        type: "error",
        message: "Email dan password wajib diisi.",
        okText: "Periksa",
        onOk: closePopup,
      });
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      saveAuth({
  token: res.token,
  user: res.user   // SIMPAN SEMUA DATA USER
});

      navigate("/");
    } catch (err) {
      const popupData = parseAuthError(err);
      showPopup({
        ...popupData,
        okText: "Periksa",
        onOk: closePopup,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-stretch">
      <div className="relative mx-auto w-full grid min-h-screen grid-cols-1 lg:grid-cols-[55%_45%]">
        <div className="hidden lg:block absolute left-1/2 -translate-x-[70%] top-12 z-20">
          <img
            src={logo_lolacake}
            alt="Lola Cake logo"
            className="w-40 h-auto"
          />
        </div>

        {/* Form */}
        <motion.div
          className="flex items-center justify-center px-6 py-10 lg:px-10"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-full max-w-md">
            <motion.div
              className="bg-[#fdecb6] rounded-[32px] shadow-[0_18px_40px_rgba(0,0,0,0.08)] px-6 py-10 md:px-6 md:py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <h1 className="text-[#8C4A24] mb-5 text-center font-extrabold text-4xl md:text-5xl">
                Welcome!
              </h1>
              <p className="text-center text-[#5E5E5E] mt-3 mb-8 text-sm md:text-base">
                Enter your email / mobile number and password to login
              </p>

              <form onSubmit={onSubmit} noValidate>
                <div className="mb-5">
                  <label className="text-sm font-medium text-[#5E5E5E]">
                    Username or Email*
                  </label>
                  <input
                    name="email"
                    type="text"
                    autoComplete="username"
                    aria-label="username-or-email"
                    className="mt-2 w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                    onChange={onChange}
                    value={form.email}
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <label className="font-medium text-[#5E5E5E]">Password*</label>
                    <Link
                      to="/auth/forgot"
                      className="text-xs md:text-sm text-[#F29B3D] hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-label="password"
                    className="w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                    onChange={onChange}
                    value={form.password}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-[#F29B3D] text-white rounded-xl py-3 text-sm md:text-base font-semibold tracking-wide hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 transition"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <p className="text-center mt-10 text-xs md:text-sm text-[#5E5E5E]">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-[#F29B3D] font-semibold">
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="relative hidden lg:block h-full w-full"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={loginhero}
            alt="login hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <Popup {...popup} />
    </div>
  );
}