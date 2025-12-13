import React, { useState } from "react"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import logo_lolacake from "../assets/loginpage/logo-lolacake.png";
import bg_lolacake from "../assets/Loginpage/bg-lolacake.png";
import { api, saveAuth } from "../lib/adminapi";                                        
import { parseAuthError } from "../lib/auth-errors";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false });

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return showPopup({
        type: "error",
        message: "Email dan password wajib diisi.",
        okText: "OK",
        onOk: closePopup,
      });
    }

    setLoading(true);

    try {
      console.log("DEBUG FORM SENT:", form);

      const res = await api.post("/login", { 
        email: form.email.trim(), 
        password: form.password 
      });

      const { token, role } = res.data;

      if (role !== "admin") {
        showPopup({
          type: "error",
          message: "Bukan akun admin!",
          okText: "OK",
          onOk: closePopup,
        });
        setLoading(false);
        return;
      }

      saveAuth({ token, user: { email: form.email, role } });
      navigate("/admin/dashboard");

    } catch (err) {
      console.log("DEBUG ERROR:", err.response?.data);
      const popupData = parseAuthError(err);
      showPopup({ ...popupData, okText: "OK", onOk: closePopup });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg_lolacake})` }}
      ></div>

      <div className="flex-1 flex justify-center items-center relative px-6 z-10">
        <img
          src={logo_lolacake}
          className="absolute top-4 left-4 w-24 md:w-32"
          alt="Logo"
        />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-brand text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <Popup {...popup} />
    </div>
  );
}
