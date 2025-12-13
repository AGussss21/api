//! BELUM
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (produk) => {
    const exist = cart.find((item) => item._id === produk._id);
    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === produk._id ? { ...item, jumlah: item.jumlah + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...produk, jumlah: 1 }]);
    }
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((item) => item._id !== id));

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, i) => acc + i.harga * i.jumlah, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};
