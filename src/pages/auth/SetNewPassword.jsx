import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import logo_lolacake from "../../assets/loginpage/logo-lolacake.png";

export default function SetNewPassword() {
  const navigate = useNavigate();
  const { state } = useLocation(); // { email, code }
  const email = state?.email;
  const code = state?.code;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({ open: false });
  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      return showPopup({
        type: "error",
        message: "Semua field wajib diisi.",
        okText: "OK",
        onOk: () => closePopup(),
      });
    }
    if (password !== confirm) {
      return showPopup({
        type: "error",
        message: "Kata sandi tidak cocok.",
        okText: "Periksa",
        onOk: () => closePopup(),
      });
    }

    // Optional: simple client-side strength check
    if (password.length < 8) {
      return showPopup({
        type: "error",
        message: "Gunakan minimal 8 karakter untuk keamanan.",
        okText: "Periksa",
        onOk: () => closePopup(),
      });
    }

    setLoading(true);
    try {
      // TODO: panggil API reset password di sini, contoh:
      // await api.post('/auth/reset-password', { email, code, password });
      // jika API gagal, throw error sehingga masuk ke catch

      showPopup({
        type: "success",
        message: "Kata sandi berhasil diperbarui. Anda sekarang dapat masuk.",
        okText: "Go to login",
        onOk: () => {
          closePopup();
          navigate("/login");
        },
      });
    } catch (err) {
      // tampilkan error dari API (sesuaikan parse error jika perlu)
      showPopup({
        type: "error",
        title: "Gagal",
        message: err?.message || "Terjadi kesalahan, coba lagi.",
        okText: "Tutup",
        onOk: () => closePopup(),
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
      <div className="max-w-3xl w-full mx-auto">
        <div className="mx-auto px-6 py-8 md:px-10 md:py-12 max-w-[720px] bg-[#fdecb6] rounded-[24px]">
          <h1
            className="text-center font-extrabold mb-4"
            style={{ color: "#3d231d", fontSize: 42 }}
          >
            Set a New Password
          </h1>

          <p className="text-center text-[#5E5E5E] mt-1 mb-6 text-sm md:text-base">
            Create a new password. Ensure it differs from your previous one for security.
            {email ? <span className="block mt-1 text-sm text-slate-600">Account: {email}</span> : null}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Password*
              </label>
              <input
                className="w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-label="new-password"
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Confirm Password*
              </label>
              <input
                className="w-full rounded-xl border border-[#E3C78B] bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                aria-label="confirm-password"
                placeholder="Ulangi password"
              />
            </div>

            <div className="flex items-center gap-2 mb-6 justify-end">
              <input
                id="showPw"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#F29B3D] focus:ring-[#F29B3D]"
                checked={show}
                onChange={() => setShow((s) => !s)}
                aria-checked={show}
              />
              <label htmlFor="showPw" className="text-sm text-slate-800 select-none">
                Show Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-2xl py-3 text-sm md:text-base font-semibold text-white transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-105"
              }`}
              style={{ background: "#f08b2d" }}
              aria-busy={loading}
            >
              {loading ? "Menyimpan..." : "Save Password"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-slate-700 hover:underline font-semibold">
              Back to Login
            </Link>
          </div>
        </div>

        <Popup {...popup} />
      </div>
    </div>
  );
}