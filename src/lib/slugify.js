// src/lib/slugify.js
export function slugify(str = "") {
  return String(str)
    .normalize("NFKD")                // handle aksen
    .replace(/[\u0300-\u036F]/g, "")  // hapus diakritik
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")      // non-alfanumerik → -
    .replace(/^-+|-+$/g, "");         // trim -
}
