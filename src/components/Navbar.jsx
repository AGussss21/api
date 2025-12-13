import React, { useEffect, useRef, useState } from "react"; 
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/navbar-brand.png";
import { MenuIcon, ShoppingCart, ChevronDown } from "lucide-react";

function readUser() {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(readUser());
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navRef = useRef(null);
  const userMenuWrapperRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    setUser(readUser());
    try {
      const raw = localStorage.getItem("user_cart");
      const list = raw ? JSON.parse(raw) : [];
      setCartCount(list.length);
    } catch {
      setCartCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const onStorage = () => {
      setUser(readUser());
      try {
        const raw = localStorage.getItem("user_cart");
        const list = raw ? JSON.parse(raw) : [];
        setCartCount(list.length);
      } catch { setCartCount(0); }
    };
    const onAuthChanged = () => setUser(readUser());
    const onCartChanged = () => {
      try {
        const raw = localStorage.getItem("user_cart");
        const list = raw ? JSON.parse(raw) : [];
        setCartCount(list.length);
      } catch { setCartCount(0); }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("cart-changed", onCartChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("cart-changed", onCartChanged);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!userMenuWrapperRef.current) return;
      if (userMenu && !userMenuWrapperRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [userMenu]);

  useEffect(() => {
    if (!navRef.current) return;

    const navEl = navRef.current;
    const rect = navEl.getBoundingClientRect();
    const initialOffset = rect.top + window.scrollY;

    function update() {
      if (window.scrollY >= initialOffset) {
        if (!isFixed) {
          setIsFixed(true);
          if (placeholderRef.current) {
            placeholderRef.current.style.height = `${navEl.offsetHeight}px`;
          }
        }
      } else {
        if (isFixed) {
          setIsFixed(false);
          if (placeholderRef.current) {
            placeholderRef.current.style.height = "0px";
          }
        }
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isFixed]);

  const displayName = (user && (user.username || user.name || user.fullName)) || "User";

  return (
    <>
      <div ref={placeholderRef} aria-hidden="true" style={{ height: 0 }} />

      <nav ref={navRef} className={`bg-brand shadow-sm z-50 w-full ${isFixed ? "fixed top-0 left-0 right-0" : "sticky top-0"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <motion.img
                src={logo}
                alt="logo"
                width="120"
                height="50"
                style={{ borderRadius: 8 }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {["Home", "Product", "About Us", "Contact"].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, color: "#FFD580" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    className="text-white font-medium"
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/keranjang" className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-orange-300 hover:bg-orange-800 relative">
                <span>Cart</span>
                <span className="ml-2 relative inline-flex">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute -top-2 -right-3 bg-white text-[#ff8c00] rounded-full text-xs font-semibold flex items-center justify-center border border-orange-400"
                      style={{ minWidth: 18, height: 18, padding: "0 5px" }}
                      aria-label={`${cartCount} items in cart`}
                      title={`${cartCount} items in cart`}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </span>
              </Link>

              {user ? (
                <Link to="/keranjang" className="inline-flex sm:hidden items-center rounded-full px-4 py-2 text-sm font-medium text-white bg-orange-300 hover:bg-orange-800" aria-label="Cart">
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span>Cart</span>
                      <ShoppingCart className="w-5 h-5 ml-2" />
                    </div>

                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute -top-2 -right-2 bg-white text-[#ff8c00] rounded-full text-xs font-semibold flex items-center justify-center border border-orange-400"
                        style={{ minWidth: 18, height: 18, padding: "0 5px" }}
                        aria-hidden={false}
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex sm:hidden items-center rounded-full px-3 py-2 text-sm font-medium bg-[#4D2B27] text-white"
                >
                  Login
                </Link>
              )}

              {user ? (
                <div ref={userMenuWrapperRef} className="relative">
                  <button
                    className="hidden sm:inline-flex items-center rounded-full bg-slate-100 text-slate-800 px-3 py-2 text-sm hover:bg-slate-200"
                    onClick={() => setUserMenu((v) => !v)}
                  >
                    Hello, {String(displayName).split(" ")[0]}
                    <ChevronDown className={`relative ml-2 top-2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none transition-transform ${userMenu ? "rotate-180" : ""}`}/>
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white shadow-soft"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.16 }}
                      >
                        <Link className="block px-3 py-2 text-sm hover:bg-slate-50" to="/profile" onClick={() => setUserMenu(false)}>
                          Profil
                        </Link>
                        <Link className="block px-3 py-2 text-sm hover:bg-slate-50" to="/profile" state={{ tab: "orders" }} onClick={() => setUserMenu(false)}>
                          Pesanan Saya
                        </Link>
                        <Link className="block px-3 py-2 text-sm hover:bg-slate-50" to="/profile" state={{ tab: "history" }} onClick={() => setUserMenu(false)}>
                          Riwayat Pemesanan
                        </Link>
                        <Link className="block px-3 py-2 text-sm hover:bg-slate-50" to="/profile" state={{ tab: "logout" }} onClick={() => setUserMenu(false)}>
                          Keluar
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-[#4D2B27] text-white hover:bg-orange-900">
                  Login / Sign Up
                </Link>
              )}

              <button
                className="inline-flex md:hidden items-center rounded-md border border-slate-300 p-2"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                className="md:hidden pb-4 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/" onClick={() => setOpen(false)}>Home</Link>
                <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/product" onClick={() => setOpen(false)}>Product</Link>
                <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/about-us" onClick={() => setOpen(false)}>About Us</Link>
                <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/contact" onClick={() => setOpen(false)}>Contact</Link>

                {user ? (
                  <>
                    <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/profile" onClick={() => setOpen(false)}>Profil</Link>
                    <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/profile" state={{ tab: "orders" }} onClick={() => setOpen(false)}>Pesanan Saya</Link>
                    <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/profile" state={{ tab: "history" }} onClick={() => setOpen(false)}>Riwayat Pemesanan</Link>
                    <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/profile" state={{ tab: "logout" }} onClick={() => setOpen(false)}>Keluar</Link>
                  </>
                ) : (
                  <Link className="block px-2 py-1 text-slate-800 hover:text-brand" to="/login" onClick={() => setOpen(false)}>Login / Sign Up</Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
