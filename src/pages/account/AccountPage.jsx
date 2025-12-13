// src/pages/AccountPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Popup from "../../components/Popup";
import ToastBanner from "../../components/ToastBanner";
import { useNavigate } from "react-router-dom";
import { User, FileText, Heart, LogOut, Camera } from "lucide-react";
import avatar from "../../assets/Profile/avatar-icon.png";
import { motion, AnimatePresence } from "framer-motion";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
    return null;
  }
}
const saveUser = (u) => localStorage.setItem("user", JSON.stringify(u));

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useMemo(() => readUser(), []);
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "akun";
  const [tab, setTab] = useState(initialTab); // akun | orders | history | logout

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", tab);
    navigate({ search: params.toString() }, { replace: true });
  }, [tab, navigate, location.search]);

  const tabs = [
    { key: "akun", label: "Akun", icon: User },
    { key: "orders", label: "Pesanan saya", icon: FileText },
    { key: "history", label: "Riwayat pemesanan", icon: Heart },
    { key: "logout", label: "Keluar", icon: LogOut },
  ];

  const [profile, setProfile] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: localStorage.getItem("user_avatar") || "",
  });

  const [pwd, setPwd] = useState({ old: "", next: "", confirm: "" });
  const [toast, setToast] = useState({ open: false, message: "" });
  const [popup, setPopup] = useState({ open: false });
  const [statusBanner, setStatusBanner] = useState(null); // success / error banner
  const fileRef = useRef();

  // ===== Dummy data untuk "Pesanan saya" & Riwayat =====
  const SAMPLE_ACTIVE_ORDERS = [
    {
      id: "ORD-1",
      code: "#3478FCHVKGO",
      type: "Self Pick Up",
      items: [
        { name: "Bolu Keju x2" },
        { name: "Bolu Zebra x2" },
      ],
      total: 280000,
      status: "unpaid", // unpaid | processing | ready | delivering
      badgeText: "Menunggu pembayaran",
      badgeTone: "warning",
      date: "22 Okt 2025",
      bottomText: "Bayar sebelum 30 Oktober 2025, pukul 23.59",
      bottomType: "danger", // warna teks merah kecil
      actions: ["Batalkan pesanan", "Bayar sekarang"],
    },
    {
      id: "ORD-2",
      code: "#3478FCHVKGO",
      type: "Self Pick Up",
      items: [{ name: "Bolu Keju" }],
      total: 75000,
      status: "unpaid",
      badgeText: "Menunggu pembayaran",
      badgeTone: "warning",
      date: "05 May 2025",
      bottomText: "Bayar sebelum 30 Oktober 2025, pukul 23.59",
      bottomType: "danger",
      actions: ["Batalkan pesanan", "Bayar sekarang"],
    },
    {
      id: "ORD-3",
      code: "#ORD-3",
      type: "Self Pick Up",
      items: [{ name: "Bolu Keju" }],
      total: 75000,
      status: "processing",
      badgeText: "Sedang Diproses",
      badgeTone: "info",
      date: "30 Okt 2025",
      bottomText:
        "Estimasi siap diambil 1-2 hari kerja setelah pembayaran dikonfirmasi.",
      bottomType: "muted",
      actions: ["Hubungi Toko"],
    },
    {
      id: "ORD-4",
      code: "#ORD-4",
      type: "Self Pick Up",
      items: [{ name: "Bolu Keju" }],
      total: 75000,
      status: "ready",
      badgeText: "Siap Diambil",
      badgeTone: "success",
      date: "05 May 2025",
      bottomText: "Ambil di jam operasional (08.00 – 17.00 WIB)",
      bottomType: "success",
      actions: ["Hubungi Toko"],
    },
    {
      id: "ORD-5",
      code: "#ORD-5",
      type: "Delivery",
      items: [{ name: "Bolu Keju" }],
      total: 75000,
      status: "delivering",
      badgeText: "Siap Dikirim",
      badgeTone: "success",
      date: "05 May 2025",
      bottomText: "Ambil di jam operasional (08.00 – 17.00 WIB)",
      bottomType: "success",
      actions: ["Hubungi Toko"],
    },
  ];

  const SAMPLE_HISTORY = [
    {
      id: "HIST-1",
      code: "#3478FCHVKGO",
      type: "Self Pick Up",
      itemName: "Bolu Keju",
      total: 75000,
      date: "30 Okt 2025",
      status: "completed", // completed | canceled
      statusText: "Selesai",
      statusTone: "success",
      bottomText: "Tanggal Selesai: 31 Oktober 2025",
      bottomTone: "danger",
      actions: ["Pesan lagi", "Tulis Ulasan"],
    },
    {
      id: "HIST-2",
      code: "#3478FCHVKGO",
      type: "Self Pick Up",
      itemName: "Bolu Keju",
      total: 75000,
      date: "30 Okt 2025",
      status: "canceled",
      statusText: "Dibatalkan",
      statusTone: "danger",
      bottomText: "Pembayaran tidak dilakukan dalam 24 jam.",
      bottomTone: "danger",
      actions: ["Pesan Ulang"],
    },
  ];

  const [orderFilter, setOrderFilter] = useState("all"); // all | unpaid | processing | taken
  const [historyFilter, setHistoryFilter] = useState("done"); // done | canceled

  const filteredActiveOrders = SAMPLE_ACTIVE_ORDERS.filter((o) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "unpaid") return o.status === "unpaid";
    if (orderFilter === "processing") return o.status === "processing";
    if (orderFilter === "taken")
      return o.status === "ready" || o.status === "delivering";
    return true;
  });

  const filteredHistory = SAMPLE_HISTORY.filter((o) =>
    historyFilter === "done" ? o.status === "completed" : o.status === "canceled"
  );

  // ====================================================
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const t = location.state?.tab;
    if (t === "orders" || t === "history" || t === "akun" || t === "logout") {
      setTab(t);
    }
  }, [location.state]);

  const showPopup = (p) => setPopup({ open: true, ...p });
  const closePopup = () => setPopup((s) => ({ ...s, open: false }));

  useEffect(() => {
    if (!statusBanner) return;
    const id = setTimeout(() => setStatusBanner(null), 4000);
    return () => clearTimeout(id);
  }, [statusBanner]);

  const onPickAvatar = () => fileRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      localStorage.setItem("user_avatar", base64);
      setProfile((p) => ({ ...p, avatar: base64 }));
      setToast({ open: true, message: "Foto profil berhasil diperbarui." });
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!pwd.old || !pwd.next || !pwd.confirm) {
      return showPopup({
        type: "error",
        message: "Lengkapi semua kolom.",
        okText: "OK",
        onOk: closePopup,
      });
    }
    if (pwd.next !== pwd.confirm) {
      return showPopup({
        type: "error",
        message: "Konfirmasi kata sandi tidak cocok.",
        okText: "OK",
        onOk: closePopup,
      });
    }
    // TODO: sambungkan ke backend
    setPwd({ old: "", next: "", confirm: "" });
    setToast({ open: true, message: "Kata sandi berhasil diperbarui." });
  };

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login", { replace: true });
  };

  const saveSimpleProfile = () => {
    try {
      const newUser = {
        ...user,
        username: profile.fullName,
        phone: profile.phone,
        email: profile.email,
      };
      saveUser(newUser);
      window.dispatchEvent(new Event("auth-changed"));
      setStatusBanner({ type: "success", message: "Profil berhasil diperbarui." });
    } catch (err) {
      console.error(err);
      setStatusBanner({ type: "error", message: "Terjadi kesalahan, coba lagi." });
    }
  };

  // ---------- animation variants ----------
  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const slideVariants = {
    left: { x: -25, opacity: 0 },
    center: { x: 0, opacity: 1 },
    right: { x: 25, opacity: 0 }
  };

  const cardHover = { scale: 1.01, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.28 }}
      className="max-w-6xl mx-auto px-4 py-6"
    >
      <div className="grid grid-cols-2 items-center mb-4 gap-4">
        <motion.h5
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="text-lg"
        >
          Hi, <b>{profile.fullName}</b>!
        </motion.h5>

        <AnimatePresence>
          {statusBanner && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-md border ${
                statusBanner.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              <span>{statusBanner.type === "error" ? "✕" : "✓"}</span>
              <span className="font-medium">{statusBanner.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 sticky top-20 h-fit">
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22 }}
            className="border border-transparent rounded-lg overflow-hidden bg-yellow-100 shadow-md"
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={`?tab=${key}`}
                className={`flex items-center gap-3 px-4 py-3 text-[#3d231d] no-underline border-b border-transparent ${
                  tab === key ? "bg-white font-semibold" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(key);
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Konten utama */}
        <div className="w-full lg:w-3/4 space-y-4">
          <AnimatePresence mode="wait">
            {tab === "akun" && (
              <motion.div
                key="akun"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <motion.div layout className="mb-1 text-xl font-semibold">Info Akun</motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <motion.div layout className="md:col-span-1">
                    <motion.div
                      layout
                      whileHover={{ scale: 1.01 }}
                      className="border border-gray-300 rounded-lg p-4 flex flex-col items-center bg-white shadow-lg h-full"
                    >
                      {profile.avatar ? (
                        <motion.img
                          src={profile.avatar}
                          alt="avatar"
                          className="w-full aspect-square object-cover rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.24 }}
                        />
                      ) : (
                        <motion.img
                          src={avatar}
                          alt="default avatar"
                          className="w-full aspect-square object-cover rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.24 }}
                        />
                      )}

                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onFileChange}
                      />
                      <motion.button
                        onClick={onPickAvatar}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-5 flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200"
                        type="button"
                      >
                        <span>Tambahkan Foto</span>
                        <Camera size={16} />
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  <motion.div layout className="md:col-span-2">
                    <motion.div layout className="border border-gray-300 rounded-lg p-4 bg-white space-y-3 shadow-lg h-full">
                      <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <motion.input
                          value={profile.fullName}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, fullName: e.target.value }))
                          }
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        />
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="flex items-center gap-2">
                          <motion.input
                            value={profile.email}
                            onChange={(e) =>
                              setProfile((p) => ({ ...p, email: e.target.value }))
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Mobile Number</div>
                        <motion.input
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                        />
                      </div>

                      <div className="text-right">
                        <motion.button
                          onClick={saveSimpleProfile}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-block mt-3 flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm bg-[#f08b2d] text-white hover:bg-orange-700"
                          type="button"
                        >
                          Simpan
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.h4 layout className="mb-1 text-xl font-semibold">Ubah Kata Sandi</motion.h4>

                <motion.div
                  layout
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg"
                >
                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 block">Old Password</label>
                      <motion.input
                        type="password"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        value={pwd.old}
                        onChange={(e) => setPwd((p) => ({ ...p, old: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block">New Password</label>
                      <motion.input
                        type="password"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        value={pwd.next}
                        onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block">Confirm Password</label>
                      <motion.input
                        type="password"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        value={pwd.confirm}
                        onChange={(e) =>
                          setPwd((p) => ({ ...p, confirm: e.target.value }))
                        }
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-3 flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-white bg-[#f08b2d] hover:bg-orange-700"
                      type="submit"
                    >
                      Simpan Perubahan
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {tab === "orders" && (
              <motion.div
                key="orders"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <motion.h4 layout className="mb-1 text-xl font-semibold">My Orders</motion.h4>
                <motion.div layout className="flex flex-wrap gap-3 mb-4">
                  {[
                    { key: "all", label: "Semua" },
                    { key: "unpaid", label: "Belum dibayar" },
                    { key: "processing", label: "Diproses" },
                    { key: "taken", label: "Diambil / Dikirim" },
                  ].map((p) => (
                    <motion.button
                      key={p.key}
                      onClick={() => setOrderFilter(p.key)}
                      whileTap={{ scale: 0.96 }}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        orderFilter === p.key
                          ? "bg-[#f08b2d] text-white border-[#f08b2d]"
                          : "bg-white"
                      }`}
                    >
                      {p.label}
                    </motion.button>
                  ))}
                </motion.div>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={orderFilter}
                      variants={slideVariants}
                      initial="right"
                      animate="center"
                      exit="left"
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {filteredActiveOrders.map((o) => (
                        <motion.div
                          key={o.id}
                          layout
                          whileHover={cardHover}
                          className="rounded-md border border-gray-300 bg-white shadow-md overflow-hidden"
                        >
                          <div className="flex justify-between items-start p-3 text-sm border-b border-gray-300">
                            <div>
                              <div className="font-medium">{o.code}</div>
                              <div className="text-sm text-gray-500">{o.type}</div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  o.badgeTone === "warning"
                                    ? "bg-yellow-50 text-yellow-800"
                                    : o.badgeTone === "info"
                                    ? "bg-blue-50 text-blue-800"
                                    : o.badgeTone === "success"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                              >
                                {o.badgeText}
                              </span>
                              <span className="text-gray-500 text-xs">{o.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-4 p-3">
                            <div className="w-[70px] h-[70px] rounded-lg bg-gray-100" />
                            <div className="flex-1">
                              {o.items.map((it, idx2) => (
                                <div key={idx2} className="text-sm">
                                  {it.name}
                                </div>
                              ))}
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">Total Harga :</span>{" "}
                                <b>Rp {o.total.toLocaleString("id-ID")}</b>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 text-sm border-t border-gray-300">
                            <div
                              className={`text-sm ${
                                o.bottomType === "danger"
                                  ? "text-red-600"
                                  : o.bottomType === "success"
                                  ? "text-green-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {o.bottomText}
                            </div>

                            <div className="flex items-center gap-2">
                              {o.actions.map((a) => (
                                <motion.button
                                  key={a}
                                  type="button"
                                  whileTap={{ scale: 0.94 }}
                                  className={`rounded-full px-3 py-1 text-sm ${
                                    a === "Bayar sekarang" || a === "Hubungi Toko"
                                      ? "bg-[#f08b2d] text-white"
                                      : "border hover:bg-gray-50"
                                  }`}
                                >
                                  {a}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {filteredActiveOrders.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 mt-3">
                          Belum ada pesanan.
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {tab === "history" && (
              <motion.div
                key="history"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <motion.h4 layout className="mb-1 text-xl font-semibold">My Orders</motion.h4>
                <motion.div layout className="flex flex-wrap gap-3 mb-4">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      historyFilter === "done" ? "bg-[#f08b2d] text-white" : "bg-white"
                    }`}
                    onClick={() => setHistoryFilter("done")}
                  >
                    Pesanan Selesai
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      historyFilter === "canceled" ? "bg-[#f08b2d] text-white" : "bg-white"
                    }`}
                    onClick={() => setHistoryFilter("canceled")}
                  >
                    Pesanan Dibatalkan
                  </motion.button>
                </motion.div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={historyFilter}
                      variants={slideVariants}
                      initial="right"
                      animate="center"
                      exit="left"
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {filteredHistory.map((o) => (
                        <motion.div
                          key={o.id}
                          layout
                          whileHover={cardHover}
                          className="rounded-md border border-gray-300 bg-white shadow-md overflow-hidden"
                        >
                          <div className="flex justify-between items-start p-3 text-sm border-b border-gray-300">
                            <div>
                              <div className="font-medium">{o.code}</div>
                              <div className="text-sm text-gray-500">{o.type}</div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  o.statusTone === "success"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                              >
                                {o.statusText}
                              </span>
                              <span className="text-gray-500 text-xs">{o.date}</span>
                            </div>
                          </div>

                          <div className="flex gap-4 p-3">
                            <div className="w-[70px] h-[70px] rounded-lg bg-gray-100" />
                            <div className="flex-1">
                              <div className="text-sm">{o.itemName}</div>
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">Total Harga :</span>{" "}
                                <b>Rp {o.total.toLocaleString("id-ID")}</b>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 text-sm border-t border-gray-300">
                            <div className={`text-sm ${o.bottomTone === "danger" ? "text-red-600" : "text-gray-500"}`}>
                              {o.bottomText}
                            </div>
                            <div className="flex items-center gap-2">
                              {o.actions.map((a) => (
                                <motion.button
                                  key={a}
                                  whileTap={{ scale: 0.94 }}
                                  className={`rounded-full px-3 py-1 text-sm ${
                                    a === "Tulis Ulasan" ? "border hover:bg-gray-50" : "bg-[#f08b2d] text-white"
                                  }`}
                                >
                                  {a}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {filteredHistory.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 mt-3">
                          Belum ada riwayat pesanan.
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {tab === "logout" && (
              <motion.div
                key="logout"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22 }}
                className="mx-auto max-w-lg p-16 border border-gray-300 rounded-xl bg-white text-center shadow-lg"
              >
                <h5 className="mb-3 text-lg font-medium">Keluar</h5>
                <p className="text-gray-500 mb-6">
                  Apakah kamu yakin ingin keluar dari akun Lola Cake?
                </p>
                <div className="mx-auto" style={{ maxWidth: 320 }}>
                  <div className="flex flex-col gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} className="rounded-full px-4 py-2 text-white bg-[#f08b2d]" type="button" onClick={doLogout}>
                      Keluar Akun
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} className="rounded-full px-4 py-2 border" type="button" onClick={() => setTab("akun")}>
                      Tetap Masuk
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ToastBanner
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: "" })}
      />
      <Popup {...popup} />
    </motion.div>
  );
}