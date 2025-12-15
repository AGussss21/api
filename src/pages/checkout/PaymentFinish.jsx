import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentFinish() {
  const location = useLocation();

  useEffect(() => {
    console.log("MIDTRANS RESULT:", location.search);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Pembayaran Berhasil
      </h1>
    </div>
  );
}
