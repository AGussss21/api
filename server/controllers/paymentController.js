// controllers/paymentController.js
import pool from "../db/connection.js"; // default export pool
import midtransClient from "midtrans-client";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

console.log("SERVER KEY =", process.env.MIDTRANS_SERVER_KEY);
console.log("LENGTH =", process.env.MIDTRANS_SERVER_KEY?.length || 0);
console.log("IS EMPTY? =", !process.env.MIDTRANS_SERVER_KEY);


const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";

const snap = new midtransClient.Snap({
  isProduction: isProd,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

function generateTransCode() {
  return `MID${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createOrder(req, res) {
  console.log("[createOrder] body:", req.body);
  try {
    const { user_email, items, payment_method  } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items required and must be an array" });
    }

    // hitung total (items.price harus number)
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty || 1), 0);
    const trans_code = generateTransCode();
    const invoice_no = `INV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    const status = "PENDING";
    const created = new Date().toISOString();
    const metaObj = { items, createdFrom: "api", note: "order created" };

    // Simpan di tabel yang ada: invoice_no, trans_code, user_id (null jika email), total, status, created, meta
    // user_id tidak tersedia langsung dari email; menyimpan null jika tak ada mapping
    const user_id = null;

    // NOTE: total col is decimal(12,2) — simpan sebagai string/number with 2 decimals
    const totalDecimal = Number(total).toFixed(2);

    try {
  await pool.execute(
    `INSERT INTO orders (invoice_no, trans_code, user_id, total, status, meta) VALUES (?, ?, ?, ?, ?, ?)`,
    [invoice_no, trans_code, user_id, totalDecimal, status, JSON.stringify(metaObj)]
  );
} catch (dbErr) {
  console.error("[createOrder] DB insert error:", dbErr);
  return res.status(500).json({ error: "db_error", details: dbErr.message });
}
    // Jika online -> panggil Midtrans Snap
    if ((payment_method || "ONLINE").toUpperCase() === "ONLINE") {
      const parameter = {
        transaction_details: { order_id: trans_code, gross_amount: Number(totalDecimal) },
        item_details: items.map(it => ({
          id: it.id,
          price: Number(it.price),
          quantity: Number(it.qty || 1),
          name: it.nama || it.title || it.id,
        })),
        customer_details: { email: user_email || undefined },
      };

      try {
        const snapResponse = await snap.createTransaction(parameter);

        // Update meta dengan info gateway
        const gatewayData = { snap: { token: snapResponse.token, redirect_url: snapResponse.redirect_url }, createdAt: new Date().toISOString() };
        // gabungkan meta lama dengan gatewayData
        const newMeta = { ...metaObj, gateway: gatewayData };

        await pool.execute("UPDATE orders SET meta = ? WHERE trans_code = ?", [JSON.stringify(newMeta), trans_code]);

        return res.status(201).json({
          invoice_no,
          trans_code,
          total: totalDecimal,
          payment_method: "ONLINE",
          snap_token: snapResponse.token,
          redirect_url: snapResponse.redirect_url,
        });
      } catch (midErr) {
        console.error("[createOrder] midtrans error:", midErr);
        // catat error di meta
        const errMeta = { ...metaObj, midtransError: String(midErr?.message || midErr) };
        await pool.execute("UPDATE orders SET meta = ? WHERE trans_code = ?", [JSON.stringify(errMeta), trans_code]);
        return res.status(502).json({ error: "midtrans_error", details: midErr.message || String(midErr) });
      }
    }

    // COD / non-online
    return res.status(201).json({ invoice_no, trans_code, total: totalDecimal, payment_method: "COD", status });
  } catch (err) {
    console.error("[createOrder] unexpected:", err);
    return res.status(500).json({ error: "internal", details: err.message });
  }
}

export async function getOrder(req, res) {
  try {
    const trans_code = req.params.order_id || req.params.trans_code; // support both param names
    if (!trans_code) return res.status(400).json({ error: "order id required" });

    const [rows] = await pool.execute("SELECT * FROM orders WHERE trans_code = ? LIMIT 1", [trans_code]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "not found" });

    const row = rows[0];
    // parse meta if possible
    try {
      row.meta = row.meta ? JSON.parse(row.meta) : null;
    } catch {
      row.meta = row.meta || null;
    }
    return res.json(row);
  } catch (err) {
    console.error("[getOrder] error:", err);
    return res.status(500).json({ error: "internal", details: err.message });
  }
}

export async function confirmPayment(req, res) {
  try {
    const { order_id, status, gateway_data } = req.body;
    if (!order_id || !status) return res.status(400).json({ error: "order_id and status required" });

    // update status and merge gateway_data to meta
    const [rows] = await pool.execute("SELECT meta FROM orders WHERE trans_code = ? LIMIT 1", [order_id]);
    let meta = {};
    if (rows && rows[0] && rows[0].meta) {
      try { meta = JSON.parse(rows[0].meta); } catch { meta = { raw: rows[0].meta }; }
    }
    meta.gateway_confirm = gateway_data || null;
    await pool.execute("UPDATE orders SET status = ?, meta = ? WHERE trans_code = ?", [status, JSON.stringify(meta), order_id]);

    return res.json({ ok: true });
  } catch (err) {
    console.error("[confirmPayment] error:", err);
    return res.status(500).json({ error: "internal", details: err.message });
  }
}

export async function midtransNotification(req, res) {
  try {
    const payload = req.body;
    // Midtrans notification payload contains order_id (we use trans_code), transaction_status etc.
    const trans_code = payload.order_id;
    if (!trans_code) return res.status(400).json({ error: "order_id missing in payload" });

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const expected = crypto.createHash("sha512").update(String(payload.order_id) + String(payload.status_code) + String(payload.gross_amount) + serverKey).digest("hex");
    if (payload.signature_key && expected !== payload.signature_key) {
      console.warn("[midtransNotification] invalid signature", { expected, got: payload.signature_key });
      // tetap balas 403 untuk midtrans
      return res.status(403).json({ error: "invalid signature" });
    }

    // map transaction_status ke status kolom kita
    let mapped = "PENDING";
    if (payload.transaction_status === "settlement" || payload.transaction_status === "capture") mapped = "PAID";
    else if (payload.transaction_status === "pending") mapped = "PENDING";
    else if (["deny", "cancel", "expire"].includes(payload.transaction_status)) mapped = "FAILED";

    // merge payload ke meta
    const [rows] = await pool.execute("SELECT meta FROM orders WHERE trans_code = ? LIMIT 1", [trans_code]);
    let meta = {};
    if (rows && rows[0] && rows[0].meta) {
      try { meta = JSON.parse(rows[0].meta); } catch { meta = { raw: rows[0].meta }; }
    }
    meta.midtrans_notification = payload;
    await pool.execute("UPDATE orders SET status = ?, meta = ? WHERE trans_code = ?", [mapped, JSON.stringify(meta), trans_code]);

    return res.json({ ok: true });
  } catch (err) {
    console.error("[midtransNotification] error:", err);
    return res.status(500).json({ error: "internal", details: err.message });
  }
}
export async function createSnapTransaction(req, res) {
  try {
    const { order_id, gross_amount, items = [], customer = {} } = req.body;

    if (!order_id || typeof gross_amount === "undefined") {
      return res.status(400).json({
        error: "invalid_payload",
        message: "order_id dan gross_amount wajib dikirimkan",
      });
    }

    // prepare item_details sesuai Midtrans spec
    const itemDetails = Array.isArray(items)
      ? items.map((it) => ({
          id: String(it.id ?? Math.random().toString(36).slice(2, 8)),
          price: Math.round(Number(it.price) || 0),
          quantity: Math.round(Number(it.qty ?? it.quantity ?? 1)),
          name: String(it.nama ?? it.name ?? it.title ?? "Item"),
        }))
      : [];

    // compute gross dari items (opsional, untuk validasi)
    const computedGross = itemDetails.reduce((s, it) => s + it.price * it.quantity, 0);

    if (itemDetails.length > 0 && Math.abs(computedGross - Math.round(Number(gross_amount))) > 1) {
      console.warn("[createSnapTransaction] gross_amount differs from items sum", { computedGross, gross_amount });
      // kita lanjutkan menggunakan gross_amount yang dikirim
    }

    const parameter = {
      transaction_details: {
        order_id: String(order_id),
        gross_amount: Math.round(Number(gross_amount) || computedGross || 0),
      },
      item_details: itemDetails,
      customer_details: {
        email: customer.email || undefined,
        first_name: customer.first_name || undefined,
        last_name: customer.last_name || undefined,
        phone: customer.phone || undefined,
      },
    };

    // request ke Midtrans
    const snapResponse = await snap.createTransaction(parameter);

    // siapkan gateway info untuk disimpan ke DB
    const gatewayData = {
      snap: {
        token: snapResponse.token || null,
        redirect_url: snapResponse.redirect_url || snapResponse.redirectUrl || null,
        raw: snapResponse,
      },
      updatedAt: new Date().toISOString(),
    };

    // cek apakah order sudah ada di DB
    try {
      const [rows] = await pool.execute("SELECT id, meta FROM orders WHERE trans_code = ? LIMIT 1", [order_id]);

      if (rows && rows.length > 0) {
        // update meta: parse existing meta dan gabungkan gatewayData
        let meta = {};
        try {
          meta = rows[0].meta ? JSON.parse(rows[0].meta) : {};
        } catch {
          meta = { raw: rows[0].meta };
        }

        meta.gateway = meta.gateway ? { ...meta.gateway, ...gatewayData } : gatewayData;
        // jika status masih kosong/undefined, tetap PENDING—status akan diupdate lewat webhook/confirm
        await pool.execute("UPDATE orders SET meta = ? WHERE trans_code = ?", [JSON.stringify(meta), order_id]);
      } else {
        // jika order belum ada, insert minimal record supaya ada trace di DB
        const invoice_no = `INV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
        const status = "PENDING";
        const totalDecimal = Number(Math.round(Number(gatewayData.snap.raw?.transaction_details?.gross_amount || parameter.transaction_details.gross_amount || 0))).toFixed(2);
        const metaObj = {
          items: itemDetails,
          createdFrom: "createSnapTransaction",
          gateway: gatewayData,
        };

        await pool.execute(
          "INSERT INTO orders (invoice_no, trans_code, user_id, total, status, meta) VALUES (?, ?, ?, ?, ?, ?)",
          [invoice_no, order_id, null, totalDecimal, status, JSON.stringify(metaObj)]
        );
      }
    } catch (dbErr) {
      // catat namun jangan gagal total — kita masih mengembalikan snap token ke client
      console.error("[createSnapTransaction] DB upsert error:", dbErr);
    }

    // kembalikan token ke frontend
    return res.status(200).json({
      success: true,
      order_id: order_id,
      snap_token: snapResponse.token || null,
      redirect_url: snapResponse.redirect_url || snapResponse.redirectUrl || null,
      raw: snapResponse,
    });
  } catch (err) {
    console.error("[createSnapTransaction] error:", err?.response?.data || err?.message || err);
    const status = err?.response?.status || 500;
    return res.status(status).json({
      success: false,
      error: "midtrans_error",
      message: err?.response?.data?.message || err?.message || "Unknown error",
      details: err?.response?.data || null,
    });
  }
}
