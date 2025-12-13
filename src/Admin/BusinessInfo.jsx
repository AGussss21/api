import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Phone, Mail, Clock, Instagram, CheckCircle } from "lucide-react";
import { api } from "../lib/api";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function BusinessInfo() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    hours: "",
    instagram: "",
    facebook: "",
    location: { lat: -6.200000, lng: 106.816666 }, // default Jakarta
  });

  useEffect(() => {
    api.getNoAuth("/business-info")
      .then(res => {
        setInfo({
          ...res,
          location: { lat: res.lat ?? -6.2, lng: res.lng ?? 106.816666 }
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/business-info/update", {
        ...info,
        lat: info.location.lat,
        lng: info.location.lng
      });
      setShowSuccess(true);
      window.scrollTo(0, 0);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan informasi usaha");
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setInfo({ ...info, location: { lat: e.latlng.lat, lng: e.latlng.lng } });
      },
    });
    return <Marker position={[info.location.lat, info.location.lng]} />;
  }

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-black">Manajemen Informasi Usaha</h1>
          <p className="text-gray-600 text-sm">Admin dapat memperbarui informasi profil, kontak, dan lokasi toko</p>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-[#D1F7C4] text-[#155724] px-4 py-3 rounded-lg flex items-center gap-2 border border-[#c3e6cb]">
            <CheckCircle size={20} className="text-[#155724]" />
            <span className="font-medium">Informasi Usaha Berhasil diPerbarui</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-[#FFF8C9] p-8 rounded-xl shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Formulir Informasi Usaha</h2>
            <form className="space-y-4">
              {["name","description","phone","email","address","hours","instagram"].map(field => (
                <div key={field}>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace("_"," ")}
                  </label>
                  {field === "description" || field === "address" ? (
                    <textarea
                      name={field}
                      value={info[field]}
                      onChange={handleChange}
                      rows={field==="description"?4:2}
                      placeholder={`Masukkan ${field}`}
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400 shadow-sm resize-none"
                    />
                  ) : (
                    <input
                      type={field==="email"?"email":"text"}
                      name={field}
                      value={info[field]}
                      onChange={handleChange}
                      placeholder={`Masukkan ${field}`}
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400 shadow-sm"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-8 pt-4">
                <button type="button" onClick={() => navigate("/admin/dashboard")}
                  className="px-8 py-2.5 rounded-lg bg-[#E0E0E0] hover:bg-gray-300 text-gray-700 font-bold transition shadow-sm">
                  Batal
                </button>
                <button type="button" onClick={handleSubmit}
                  className="px-8 py-2.5 rounded-lg bg-[#F2994A] hover:bg-orange-500 text-white font-bold transition shadow-md">
                  Simpan
                </button>
              </div>
            </form>
          </div>

          {/* Peta */}
          <div className="bg-[#FFF8C9] p-8 rounded-xl shadow-sm h-fit space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-1 text-gray-800">Lokasi Usaha</h3>
              <div className="w-full h-48 rounded-xl overflow-hidden relative mb-2 shadow-inner group">
                <MapContainer
                  center={[info.location.lat, info.location.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-xs text-gray-500 mb-4">Klik pada peta untuk memperbarui lokasi usaha.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
