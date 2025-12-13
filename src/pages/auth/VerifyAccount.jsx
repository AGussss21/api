import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo_lolacake from "../../assets/loginpage/logo-lolacake.png";

function OtpInput({ length = 6, onComplete }) {
  const inputs = Array.from({ length });
  const refs = useRef([]);
  // Inisialisasi nilai tiap input (disimpan di DOM value, tidak di state untuk performance)
  useEffect(() => {
    refs.current = refs.current.slice(0, length);
  }, [length]);

  const focusAt = (idx) => {
    refs.current[idx]?.focus();
    refs.current[idx]?.select();
  };

  const getCode = () => refs.current.map((r) => r?.value || "").join("");

  const handleChange = (e, idx) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 1);
    e.target.value = v;
    if (v && idx < length - 1) {
      focusAt(idx + 1);
    }
    const code = getCode();
    if (code.length === length) {
      onComplete?.(code);
    }
  };

  const handleKeyDown = (e, idx) => {
    const key = e.key;

    // Backspace: jika kosong -> pindah ke input sebelumnya
    if (key === "Backspace") {
      if (!e.currentTarget.value && idx > 0) {
        focusAt(idx - 1);
      } else {
        e.currentTarget.value = "";
      }
      return;
    }

    // Arrow navigation
    if (key === "ArrowLeft" && idx > 0) {
      focusAt(idx - 1);
      e.preventDefault();
      return;
    }
    if (key === "ArrowRight" && idx < length - 1) {
      focusAt(idx + 1);
      e.preventDefault();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === "v") {
      return;
    }
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, length - idx).split("");
    if (digits.length === 0) return;
    digits.forEach((d, i) => {
      const ref = refs.current[idx + i];
      if (ref) ref.value = d;
    });
    const nextIndex = Math.min(length - 1, idx + digits.length - 1);
    focusAt(nextIndex);
    const code = getCode();
    if (code.length === length) onComplete?.(code);
  };

  return (
    <div className="flex justify-center gap-3 my-6">
      {inputs.map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="w-11 h-11 rounded-lg border border-[#E3C78B] bg-white text-center text-lg font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
          style={{ lineHeight: "44px" }}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`otp-digit-${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function VerifyAccount() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const RESEND_SECONDS = 45;
  const STORAGE_KEY = "otpDeadline";

  const [deadline, setDeadline] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);

  // Inisialisasi atau ambil deadline dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let d = stored ? new Date(stored) : null;
    if (!d || isNaN(d.getTime()) || d.getTime() <= Date.now()) {
      d = new Date(Date.now() + RESEND_SECONDS * 1000);
      localStorage.setItem(STORAGE_KEY, d.toISOString());
    }
    setDeadline(d);
  }, []);

  // Tick countdown
  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
      setCountdown(diff);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const onVerify = (code) => {
    navigate("/auth/set-password", { state: { email, code } });
  };

  const handleManualVerify = () => {
    // optional: jika mau verify dari tombol manual (mis. untuk testing)
    // _JANGAN_ gunakan ini di produksi; lebih baik biarkan OTP dipicu dari OtpInput.onComplete.
    onVerify("000000");
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setResending(true);
      // TODO: panggil API untuk kirim ulang OTP. Contoh:
      // await api.post('/auth/resend-otp', { email });

      // setelah sukses, set ulang deadline
      const newDeadline = new Date(Date.now() + RESEND_SECONDS * 1000);
      localStorage.setItem(STORAGE_KEY, newDeadline.toISOString());
      setDeadline(newDeadline);
    } catch (err) {
      // handle error (tampilkan toast / popup)
      console.error("Failed to resend OTP:", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex items-start">
      <div className="w-full mx-auto">
        <div className="flex justify-end mb-6 -translate-x-20 top-12 z-20">
          <img src={logo_lolacake} alt="Lola Cake logo" className="w-36" />
        </div>

        <div className="mx-auto px-6 py-6 md:px-10 md:py-10 max-w-[720px] bg-[#fdecb6] rounded-[24px]">
          <h1 className="text-[#8C4A24] mb-4 text-center font-extrabold text-3xl md:text-4xl">
            Verify Your Account
          </h1>

          <p className="text-center text-[#5E5E5E] mt-1 mb-6 text-sm md:text-base">
            Kami telah mengirimkan kode verifikasi {String(6)}-digit ke email Anda
            {email ? ` (${email})` : ""}.<br />
            Silakan masukkan di bawah ini untuk melanjutkan.
          </p>

          <OtpInput
            length={6}
            onComplete={(code) => {
              // biasakan mem-verifikasi kode via API di sini jika perlu,
              // sekarang navigasi ke set-password dengan membawa code
              onVerify(code);
            }}
          />

          <button
            type="button"
            onClick={handleManualVerify}
            className="w-full bg-[#F29B3D] text-white rounded-xl py-3 text-sm md:text-base font-semibold tracking-wide hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 transition mb-3"
            style={{ background: "#f08b2d", color: "#fff" }}
            aria-label="verify-code-button"
          >
            Verifikasi Kode
          </button>

          <div className="text-center mt-2">
            {countdown > 0 ? (
              <p className="text-center mt-3 text-xs md:text-sm text-[#5E5E5E]">
                Tidak mendapatkan kode?{" "}
                <span className="font-medium text-[#F29B3D]">
                  Kirim ulang dalam {countdown} detik
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-[#F29B3D] font-medium hover:underline"
              >
                {resending ? "Mengirim..." : "Kirim ulang sekarang"}
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-slate-700 hover:underline font-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}