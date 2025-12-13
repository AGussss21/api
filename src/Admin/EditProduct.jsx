import React, { useState } from "react";
import { api } from "../lib/adminapi";

export default function EditProduct({ product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description,
  });

  const onChange = (e) => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // ROUTE YANG BENAR
      await api.put(`/products/${product.id}`, form);


      onUpdate();  // reload list produk
      onClose();   // tutup modal
    } catch (err) {
      console.error(err);
      alert("Gagal update produk!");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="name" value={form.name} onChange={onChange} placeholder="Nama" />
      <input name="price" type="number" value={form.price} onChange={onChange} placeholder="Harga" />
      <input name="stock" type="number" value={form.stock} onChange={onChange} placeholder="Stok" />
      <textarea name="description" value={form.description} onChange={onChange} placeholder="Deskripsi" />
      <button type="submit">Simpan</button>
    </form>
  );
}
