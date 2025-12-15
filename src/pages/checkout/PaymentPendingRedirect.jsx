import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPendingRedirect() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    // optional: log dari midtrans
    console.log("MIDTRANS PENDING:", loc.search);

    nav("/checkout/payment-waiting", { replace: true });
  }, []);

  return <p className="text-center mt-20">Mengalihkan ke halaman pembayaran...</p>;
}
