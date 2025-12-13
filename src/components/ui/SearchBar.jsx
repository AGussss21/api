import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // icon search dari lucide-react

export default function SearchBar({
  placeholder = "Search...",
  description = "",
  initialValue = "",
  onSearch,
  from,
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialValue || "");
  const [loading, setLoading] = useState(false);

  const doSearch = (query) => {
    if (!query || query.trim() === "") return;
    if (onSearch) {
      onSearch(query.trim());
      return;
    }
    setLoading(true);
    try {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`, {
        state: { from: from || null, description },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doSearch(q);
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-3 items-center">
        <label htmlFor="site-search" className="sr-only">
          Search
        </label>

        {/* wrapper untuk icon + input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="site-search"
            name="search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full h-14 rounded-full border border-slate-300 bg-white pl-12 pr-4 text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#F29B3D]"
            aria-label="Search products"
            autoComplete="off"
          />
        </div>
      </div>

      {description ? (
        <p className="mt-3 text-center text-sm text-slate-600">{description}</p>
      ) : null}
    </form>
  );
}