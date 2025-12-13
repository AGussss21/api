// Data Produk

const products = [
  /* ---------------------------
     SATUAN - BREAD (4)
     --------------------------- */
  {
    id: "s-bread-01",
    nama: "Roti Coklat",
    category: "Bread",
    desc: "Roti lembut berisi coklat leleh, cocok untuk sarapan atau camilan.",
    img: "/assets/Product/Satuan/Bread/roti coklat.png",
    price: 18000,
    createdAt: "2024-08-10",
    stock: 120,
    sold: 340,
    reviews: [
      { id: "r-s-bread-01-1", name: "Ayu", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-09-01", text: "Empuk dan manisnya pas. Anak saya suka!" },
      { id: "r-s-bread-01-2", name: "Budi", avatar: "/assets/avatars/avatar2.png", rating: 4, createdAt: "2024-09-05", text: "Coklatnya melimpah, enak." }
    ]
  },
  {
    id: "s-bread-02",
    nama: "Roti Keju",
    category: "Bread",
    desc: "Roti isi keju serut, gurih dan lembut.",
    img: "/assets/Product/Satuan/Bread/roti keju.png",
    price: 20000,
    createdAt: "2024-07-25",
    stock: 90,
    sold: 210,
    reviews: [
      { id: "r-s-bread-02-1", name: "Citra", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-08-02", text: "Keju nya nyatu banget, recommended." },
      { id: "r-s-bread-02-2", name: "Doni", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-08-10", text: "Pas untuk sarapan." }
    ]
  },
  {
    id: "s-bread-03",
    nama: "Roti Pisang Coklat",
    category: "Bread",
    desc: "Roti isi pisang dan coklat, paduan manis dan lembut.",
    img: "/assets/Product/Satuan/Bread/roti pisang coklat.png",
    price: 19000,
    createdAt: "2024-09-05",
    stock: 70,
    sold: 150,
    reviews: [
      { id: "r-s-bread-03-1", name: "Erna", avatar: "/assets/avatars/avatar5.png", rating: 5, createdAt: "2024-09-12", text: "Tekstur lembut dan wangi pisangnya." }
    ]
  },
  {
    id: "s-bread-04",
    nama: "Roti Sosis",
    category: "Bread",
    desc: "Roti lapis sosis, favorit anak-anak untuk bekal.",
    img: "/assets/Product/Satuan/Bread/roti sosis.png",
    price: 22000,
    createdAt: "2024-06-30",
    stock: 150,
    sold: 420,
    reviews: [
      { id: "r-s-bread-04-1", name: "Fajar", avatar: "/assets/avatars/avatar6.png", rating: 4, createdAt: "2024-07-10", text: "Sosisnya enak, porsi pas." }
    ]
  },

  /* ---------------------------
     SATUAN - COOKIE (12+)
     --------------------------- */
  {
    id: "s-cookie-01",
    nama: "Good Time",
    category: "Cookie",
    desc: "Cookie klasik Good Time, renyah dengan coklat serut.",
    img: "/assets/Product/Satuan/Cookie/good time.png",
    price: 7000,
    createdAt: "2024-05-15",
    stock: 400,
    sold: 1200,
    reviews: [
      { id: "r-s-cookie-01-1", name: "Gina", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-05-20", text: "Nostalgia banget rasanya!" }
    ]
  },
  {
    id: "s-cookie-02",
    nama: "Cookie Image 321",
    category: "Cookie",
    desc: "Cookie spesial dengan topping unik (image 321).",
    img: "/assets/Product/Satuan/Cookie/image 321.png",
    price: 9000,
    createdAt: "2024-07-02",
    stock: 200,
    sold: 320,
    reviews: [
      { id: "r-s-cookie-02-1", name: "Hana", avatar: "/assets/avatars/avatar2.png", rating: 4, createdAt: "2024-07-12", text: "Unik, tapi agak manis." }
    ]
  },
  {
    id: "s-cookie-03",
    nama: "Kastangel",
    category: "Cookie",
    desc: "Kue kastangel gurih berbahan keju premium.",
    img: "/assets/Product/Satuan/Cookie/kastangel.png",
    price: 25000,
    createdAt: "2024-04-20",
    stock: 180,
    sold: 540,
    reviews: [
      { id: "r-s-cookie-03-1", name: "Iwan", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-05-01", text: "Keju nya berasa, enak buat hantaran." }
    ]
  },
  {
    id: "s-cookie-04",
    nama: "Nastar Durian",
    category: "Cookie",
    desc: "Nastar isi durian, aroma khas dan legit.",
    img: "/assets/Product/Satuan/Cookie/nastar durian.png",
    price: 27000,
    createdAt: "2024-06-03",
    stock: 120,
    sold: 260,
    reviews: [
      { id: "r-s-cookie-04-1", name: "Joko", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-06-08", text: "Aromanya kuat, cocok bagi penggemar durian." }
    ]
  },
  {
    id: "s-cookie-05",
    nama: "Nastar Keranjang",
    category: "Cookie",
    desc: "Nastar klasik disajikan dalam bentuk keranjang lucu.",
    img: "/assets/Product/Satuan/Cookie/nastar keranjang.png",
    price: 26000,
    createdAt: "2024-06-15",
    stock: 90,
    sold: 140,
    reviews: [
      { id: "r-s-cookie-05-1", name: "Lia", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-06-20", text: "Cakep buat hantaran." }
    ]
  },
  {
    id: "s-cookie-06",
    nama: "Nutella Cookie",
    category: "Cookie",
    desc: "Cookie lembut berisi selai Nutella yang lumer.",
    img: "/assets/Product/Satuan/Cookie/nutella.png",
    price: 10000,
    createdAt: "2024-08-01",
    stock: 220,
    sold: 580,
    reviews: [
      { id: "r-s-cookie-06-1", name: "Maya", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-08-05", text: "Favorit! Nutella nya melimpah." }
    ]
  },
  {
    id: "s-cookie-07",
    nama: "Putri Salju Pandan",
    category: "Cookie",
    desc: "Putri salju rasa pandan, lembut dan harum.",
    img: "/assets/Product/Satuan/Cookie/putri salju pandan.png",
    price: 12000,
    createdAt: "2024-09-01",
    stock: 140,
    sold: 230,
    reviews: [
      { id: "r-s-cookie-07-1", name: "Nina", avatar: "/assets/avatars/avatar1.png", rating: 4, createdAt: "2024-09-10", text: "Rasa pandan nya subtle." }
    ]
  },
  {
    id: "s-cookie-08",
    nama: "Putri Salju",
    category: "Cookie",
    desc: "Putri salju klasik, taburan gula halus yang lembut.",
    img: "/assets/Product/Satuan/Cookie/putri salju.png",
    price: 11000,
    createdAt: "2024-04-01",
    stock: 160,
    sold: 410,
    reviews: [
      { id: "r-s-cookie-08-1", name: "Oni", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-04-10", text: "Tekstur pas, nggak lengket." }
    ]
  },
  {
    id: "s-cookie-09",
    nama: "Rambutan Coklat",
    category: "Cookie",
    desc: "Cookie unik berbentuk rambutan dengan coklat topping.",
    img: "/assets/Product/Satuan/Cookie/rambutan coklat.png",
    price: 9000,
    createdAt: "2024-10-01",
    stock: 80,
    sold: 95,
    reviews: [
      { id: "r-s-cookie-09-1", name: "Putu", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-10-05", text: "Unik dan lucu, rasanya enak." }
    ]
  },
  {
    id: "s-cookie-10",
    nama: "Stik Coklat",
    category: "Cookie",
    desc: "Stik coklat renyah, cocok untuk teman minum teh.",
    img: "/assets/Product/Satuan/Cookie/stik coklat.png",
    price: 8000,
    createdAt: "2024-03-20",
    stock: 300,
    sold: 900,
    reviews: [
      { id: "r-s-cookie-10-1", name: "Rani", avatar: "/assets/avatars/avatar4.png", rating: 5, createdAt: "2024-03-25", text: "Garing dan manis pas." }
    ]
  },
  {
    id: "s-cookie-11",
    nama: "Thumbprint Strawberry",
    category: "Cookie",
    desc: "Kue kering thumbprint dengan selai stroberi khas.",
    img: "/assets/Product/Satuan/Cookie/thumprint strawberry.png",
    price: 13000,
    createdAt: "2024-07-28",
    stock: 110,
    sold: 200,
    reviews: [
      { id: "r-s-cookie-11-1", name: "Sari", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-08-01", text: "Selai nya enak, manis pas." }
    ]
  },
  {
    id: "s-cookie-12",
    nama: "Choco Chips",
    category: "Cookie",
    desc: "Classic choco chips cookie, renyah dan penuh coklat.",
    img: "/assets/Product/Satuan/Cookie/choco chips.png",
    price: 9000,
    createdAt: "2024-02-10",
    stock: 260,
    sold: 780,
    reviews: [
      { id: "r-s-cookie-12-1", name: "Tono", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-02-16", text: "Coklatnya banyak, mantap." }
    ]
  },

  /* ---------------------------
     SATUAN - DESSERT (7)
     --------------------------- */
  {
    id: "s-dessert-01",
    nama: "Pudding Buah",
    category: "Dessert",
    desc: "Pudding lembut dengan potongan buah segar.",
    img: "/assets/Product/Satuan/Dessert/pudding buah.png",
    price: 15000,
    createdAt: "2024-07-18",
    stock: 140,
    sold: 320,
    reviews: [
      { id: "r-s-dessert-01-1", name: "Umi", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-07-22", text: "Segar dan lembut." }
    ]
  },
  {
    id: "s-dessert-02",
    nama: "Pudding Caramel",
    category: "Dessert",
    desc: "Pudding klasik dengan karamel lembut.",
    img: "/assets/Product/Satuan/Dessert/pudding caramel.png",
    price: 15000,
    createdAt: "2024-06-11",
    stock: 100,
    sold: 220,
    reviews: [
      { id: "r-s-dessert-02-1", name: "Vina", avatar: "/assets/avatars/avatar2.png", rating: 4, createdAt: "2024-06-20", text: "Gurih-manis karamelnya." }
    ]
  },
  {
    id: "s-dessert-03",
    nama: "Pudding Coklat",
    category: "Dessert",
    desc: "Pudding rasa coklat intens untuk pencinta coklat.",
    img: "/assets/Product/Satuan/Dessert/pudding coklat.png",
    price: 16000,
    createdAt: "2024-08-05",
    stock: 130,
    sold: 280,
    reviews: [
      { id: "r-s-dessert-03-1", name: "Wawan", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-08-10", text: "Coklatnya pekat dan creamy." }
    ]
  },
  {
    id: "s-dessert-04",
    nama: "Pudding Crispy",
    category: "Dessert",
    desc: "Pudding dengan topping renyah untuk tekstur kontras.",
    img: "/assets/Product/Satuan/Dessert/pudding crispy.png",
    price: 17000,
    createdAt: "2024-09-12",
    stock: 90,
    sold: 140,
    reviews: [
      { id: "r-s-dessert-04-1", name: "Xenia", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-09-20", text: "Topping crispy nya nendang." }
    ]
  },
  {
    id: "s-dessert-05",
    nama: "Pudding Dodol",
    category: "Dessert",
    desc: "Kreasi pudding berpadu rasa dodol tradisional.",
    img: "/assets/Product/Satuan/Dessert/pudding dodol.png",
    price: 17000,
    createdAt: "2024-05-30",
    stock: 70,
    sold: 85,
    reviews: [
      { id: "r-s-dessert-05-1", name: "Yosef", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-06-05", text: "Rasa lokal yang menarik." }
    ]
  },
  {
    id: "s-dessert-06",
    nama: "Pudding Negro",
    category: "Dessert",
    desc: "Pudding dark chocolate (negro) bernuansa intens.",
    img: "/assets/Product/Satuan/Dessert/pudding negro.png",
    price: 18000,
    createdAt: "2024-10-05",
    stock: 60,
    sold: 75,
    reviews: [
      { id: "r-s-dessert-06-1", name: "Zaki", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-10-10", text: "Beneran cocok untuk pecinta coklat pekat." }
    ]
  },
  {
    id: "s-dessert-07",
    nama: "Pudding Batik",
    category: "Dessert",
    desc: "Pudding dekoratif motif batik untuk hadiah spesial.",
    img: "/assets/Product/Satuan/Dessert/pudding batik.png",
    price: 22000,
    createdAt: "2024-11-02",
    stock: 40,
    sold: 20,
    reviews: [
      { id: "r-s-dessert-07-1", name: "Anisa", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-11-05", text: "Cantik untuk hantaran." }
    ]
  },

  /* ---------------------------
     SATUAN - DONUT (8)
     --------------------------- */
  {
    id: "s-donut-01",
    nama: "Donat Keju Serut",
    category: "Donut",
    desc: "Donat dengan topping keju serut yang gurih.",
    img: "/assets/Product/Satuan/Donut/donat keju serut.png",
    price: 8000,
    createdAt: "2024-03-12",
    stock: 300,
    sold: 950,
    reviews: [
      { id: "r-s-donut-01-1", name: "Bima", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-03-20", text: "Keju nya mantap." }
    ]
  },
  {
    id: "s-donut-02",
    nama: "Donat Messes Coklat",
    category: "Donut",
    desc: "Donat bertabur coklat messes manis.",
    img: "/assets/Product/Satuan/Donut/donat messes coklat.png",
    price: 8000,
    createdAt: "2024-04-01",
    stock: 240,
    sold: 660,
    reviews: [
      { id: "r-s-donut-02-1", name: "Caca", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-04-05", text: "Manis dan pas." }
    ]
  },
  {
    id: "s-donut-03",
    nama: "Donat Oreo",
    category: "Donut",
    desc: "Donat dengan remahan Oreo di atasnya.",
    img: "/assets/Product/Satuan/Donut/donat oreo.png",
    price: 9000,
    createdAt: "2024-05-05",
    stock: 200,
    sold: 430,
    reviews: [
      { id: "r-s-donut-03-1", name: "Dewi", avatar: "/assets/avatars/avatar4.png", rating: 5, createdAt: "2024-05-12", text: "Crispy luar, lembut dalam." }
    ]
  },
  {
    id: "s-donut-04",
    nama: "Donat Strawberry Choco Crunch",
    category: "Donut",
    desc: "Perpaduan strawberry dan choco crunchy.",
    img: "/assets/Product/Satuan/Donut/donat strawberry choco crunch.png",
    price: 9500,
    createdAt: "2024-06-20",
    stock: 150,
    sold: 200,
    reviews: [
      { id: "r-s-donut-04-1", name: "Eko", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-06-25", text: "Segar dan manis." }
    ]
  },
  {
    id: "s-donut-05",
    nama: "Donat Tiramisu",
    category: "Donut",
    desc: "Donat rasa tiramisu, elegan dan lembut.",
    img: "/assets/Product/Satuan/Donut/donat tiramisu.png",
    price: 12000,
    createdAt: "2024-09-01",
    stock: 80,
    sold: 95,
    reviews: [
      { id: "r-s-donut-05-1", name: "Feni", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-09-08", text: "Rasa tiramisu terasa nyata." }
    ]
  },
  {
    id: "s-donut-06",
    nama: "Donat Coklat Drizzle",
    category: "Donut",
    desc: "Donat dilapisi coklat drizzle, cocok untuk pecinta coklat.",
    img: "/assets/Product/Satuan/Donut/donat coklat drizzle.png",
    price: 8500,
    createdAt: "2024-02-18",
    stock: 210,
    sold: 420,
    reviews: [
      { id: "r-s-donut-06-1", name: "Gilang", avatar: "/assets/avatars/avatar1.png", rating: 4, createdAt: "2024-02-25", text: "Coklatnya tasty." }
    ]
  },
  {
    id: "s-donut-07",
    nama: "Donat Gula Salju",
    category: "Donut",
    desc: "Donat manis berlapis gula halus ala salju.",
    img: "/assets/Product/Satuan/Donut/donat gula salju.png",
    price: 7000,
    createdAt: "2024-01-10",
    stock: 350,
    sold: 1000,
    reviews: [
      { id: "r-s-donut-07-1", name: "Hani", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-01-15", text: "Enak dan ringan." }
    ]
  },
  {
    id: "s-donut-08",
    nama: "Donat Kacang Crunch",
    category: "Donut",
    desc: "Donat topping kacang renyah untuk tekstur ekstra.",
    img: "/assets/Product/Satuan/Donut/donat kacang crunch.png",
    price: 9500,
    createdAt: "2024-03-30",
    stock: 160,
    sold: 280,
    reviews: [
      { id: "r-s-donut-08-1", name: "Ika", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-04-02", text: "Crunchy dan lezat." }
    ]
  },

  /* ---------------------------
     SATUAN - Cake (10)
     --------------------------- */
  {
    id: "s-kue-01",
    nama: "Bolu Gulung",
    category: "Cake",
    desc: "Bolu gulung klasik dengan isian krim lembut.",
    img: "/assets/Product/Satuan/Cake/bolu gulung.png",
    price: 65000,
    createdAt: "2024-05-05",
    stock: 40,
    sold: 120,
    reviews: [
      { id: "r-s-kue-01-1", name: "Jeni", avatar: "/assets/avatars/avatar4.png", rating: 5, createdAt: "2024-05-12", text: "Lembut dan moist." }
    ]
  },
  {
    id: "s-kue-02",
    nama: "Bolu Keju (besar)",
    category: "Cake",
    desc: "Bolu keju ukuran besar dengan keju asli.",
    img: "/assets/Product/Satuan/Cake/bolu keju.png",
    price: 120000,
    createdAt: "2024-04-12",
    stock: 25,
    sold: 300,
    reviews: [
      { id: "r-s-kue-02-1", name: "Kiki", avatar: "/assets/avatars/avatar5.png", rating: 5, createdAt: "2024-04-18", text: "Keju nya legit!" }
    ]
  },
  {
    id: "s-kue-03",
    nama: "Bolu Lapis Surabaya",
    category: "Cake",
    desc: "Kue lapis surabaya tradisional, moist dan legit.",
    img: "/assets/Product/Satuan/Cake/bolu lapis surabaya.png",
    price: 140000,
    createdAt: "2024-03-20",
    stock: 15,
    sold: 90,
    reviews: [
      { id: "r-s-kue-03-1", name: "Lutfi", avatar: "/assets/avatars/avatar6.png", rating: 4, createdAt: "2024-03-28", text: "Autentik rasa Surabaya." }
    ]
  },
  {
    id: "s-kue-04",
    nama: "Bolu Pandan",
    category: "Cake",
    desc: "Bolu pandan wangi dengan tekstur lembut.",
    img: "/assets/Product/Satuan/Cake/bolu pandan.png",
    price: 70000,
    createdAt: "2024-08-12",
    stock: 60,
    sold: 180,
    reviews: [
      { id: "r-s-kue-04-1", name: "Mira", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-08-20", text: "Aroma pandan nya kuat." }
    ]
  },
  {
    id: "s-kue-05",
    nama: "Bolu Pisang",
    category: "Cake",
    desc: "Bolu pisang moist dengan rasa pisang natural.",
    img: "/assets/Product/Satuan/Cake/bolu pisang.png",
    price: 68000,
    createdAt: "2024-02-14",
    stock: 55,
    sold: 140,
    reviews: [
      { id: "r-s-kue-05-1", name: "Nora", avatar: "/assets/avatars/avatar2.png", rating: 4, createdAt: "2024-02-20", text: "Enak dan wangi pisang." }
    ]
  },
  {
    id: "s-kue-06",
    nama: "Bolu Zebra",
    category: "Cake",
    desc: "Bolu zebra klasik dengan lapisan coklat-vanila.",
    img: "/assets/Product/Satuan/Cake/bolu zebra.png",
    price: 75000,
    createdAt: "2024-09-10",
    stock: 70,
    sold: 210,
    reviews: [
      { id: "r-s-kue-06-1", name: "Okti", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-09-15", text: "Tekstur lembut, rasa seimbang." }
    ]
  },
  {
    id: "s-kue-07",
    nama: "Brownies Coklat",
    category: "Cake",
    desc: "Brownies coklat fudgy dengan tekstur lembab.",
    img: "/assets/Product/Satuan/Cake/brownies coklat.png",
    price: 85000,
    createdAt: "2024-10-20",
    stock: 40,
    sold: 300,
    reviews: [
      { id: "r-s-kue-07-1", name: "Pia", avatar: "/assets/avatars/avatar4.png", rating: 5, createdAt: "2024-11-01", text: "Super fudgy, recommended." }
    ]
  },
  {
    id: "s-kue-08",
    nama: "Bolu Caramel",
    category: "Cake",
    desc: "Bolu dengan lapisan caramel lembut.",
    img: "/assets/Product/Satuan/Cake/bolu caramel.png",
    price: 78000,
    createdAt: "2024-06-07",
    stock: 30,
    sold: 60,
    reviews: [
      { id: "r-s-kue-08-1", name: "Rika", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-06-14", text: "Caramel nya pas." }
    ]
  },
  {
    id: "s-kue-09",
    nama: "Bolu Cuke",
    category: "Cake",
    desc: "Cake khas 'cuke' (varian lokal) dengan rasa khas.",
    img: "/assets/Product/Satuan/Cake/bolu cuke.png",
    price: 70000,
    createdAt: "2024-01-20",
    stock: 20,
    sold: 45,
    reviews: [
      { id: "r-s-kue-09-1", name: "Sigit", avatar: "/assets/avatars/avatar6.png", rating: 4, createdAt: "2024-02-02", text: "Rasa tradisional yang enak." }
    ]
  },
  {
    id: "s-kue-10",
    nama: "Bolu Gula Merah",
    category: "Cake",
    desc: "Bolu dengan gula merah alami, aroma karamel tradisional.",
    img: "/assets/Product/Satuan/Cake/bolu gula merah.png",
    price: 72000,
    createdAt: "2024-03-03",
    stock: 35,
    sold: 75,
    reviews: [
      { id: "r-s-kue-10-1", name: "Tari", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-03-10", text: "Rasa gula merahnya hangat dan legit." }
    ]
  },

  /* ---------------------------
     SATUAN - TRADISIONAL (12+)
     --------------------------- */
  {
    id: "s-trad-01",
    nama: "Jalangkote",
    category: "Tradisional",
    desc: "Jalangkote khas, isian gurih pedas manis.",
    img: "/assets/Product/Satuan/Tradisional/jalangkote.png",
    price: 15000,
    createdAt: "2024-04-10",
    stock: 120,
    sold: 400,
    reviews: [
      { id: "r-s-trad-01-1", name: "Andi", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-04-15", text: "Gurih dan cocok untuk cemilan." }
    ]
  },
  {
    id: "s-trad-02",
    nama: "Pai Buah",
    category: "Tradisional",
    desc: "Pai buah segar dengan kulit renyah.",
    img: "/assets/Product/Satuan/Tradisional/pai buah.png",
    price: 18000,
    createdAt: "2024-07-02",
    stock: 80,
    sold: 160,
    reviews: [
      { id: "r-s-trad-02-1", name: "Bella", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-07-08", text: "Buahnya segar." }
    ]
  },
  {
    id: "s-trad-03",
    nama: "Pai Susu",
    category: "Tradisional",
    desc: "Pai susu klasik manis lembut.",
    img: "/assets/Product/Satuan/Tradisional/pai susu.png",
    price: 16000,
    createdAt: "2024-05-12",
    stock: 90,
    sold: 200,
    reviews: [
      { id: "r-s-trad-03-1", name: "Chandra", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-05-20", text: "Lembut dan manis pas." }
    ]
  },
  {
    id: "s-trad-04",
    nama: "Panada",
    category: "Tradisional",
    desc: "Panada isi ikan yang gurih dan pedas.",
    img: "/assets/Product/Satuan/Tradisional/panada.png",
    price: 17000,
    createdAt: "2024-03-22",
    stock: 100,
    sold: 260,
    reviews: [
      { id: "r-s-trad-04-1", name: "Dede", avatar: "/assets/avatars/avatar5.png", rating: 5, createdAt: "2024-03-30", text: "Isian ikannya berasa." }
    ]
  },
  {
    id: "s-trad-05",
    nama: "Risol Mayo",
    category: "Tradisional",
    desc: "Risol isi mayones dan sayur, gurih lembut.",
    img: "/assets/Product/Satuan/Tradisional/risol mayo.png",
    price: 12000,
    createdAt: "2024-02-04",
    stock: 140,
    sold: 360,
    reviews: [
      { id: "r-s-trad-05-1", name: "Erwin", avatar: "/assets/avatars/avatar6.png", rating: 4, createdAt: "2024-02-10", text: "Cocok untuk acara." }
    ]
  },
  {
    id: "s-trad-06",
    nama: "Risoles",
    category: "Tradisional",
    desc: "Risoles renyah dengan isi sayur dan daging cincang.",
    img: "/assets/Product/Satuan/Tradisional/risoles.png",
    price: 13000,
    createdAt: "2024-01-20",
    stock: 160,
    sold: 420,
    reviews: [
      { id: "r-s-trad-06-1", name: "Fira", avatar: "/assets/avatars/avatar1.png", rating: 5, createdAt: "2024-01-28", text: "Risolesnya ga pelit isi." }
    ]
  },
  {
    id: "s-trad-07",
    nama: "Sus Buah",
    category: "Tradisional",
    desc: "Sus berisi krim dan buah segar, manis dan lembut.",
    img: "/assets/Product/Satuan/Tradisional/sus buah.png",
    price: 20000,
    createdAt: "2024-08-05",
    stock: 70,
    sold: 125,
    reviews: [
      { id: "r-s-trad-07-1", name: "Gita", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-08-12", text: "Isian buahnya fresh!" }
    ]
  },
  {
    id: "s-trad-08",
    nama: "Sus",
    category: "Tradisional",
    desc: "Sus polos klasik untuk cemilan manis.",
    img: "/assets/Product/Satuan/Tradisional/sus.png",
    price: 12000,
    createdAt: "2024-09-20",
    stock: 110,
    sold: 210,
    reviews: [
      { id: "r-s-trad-08-1", name: "Hendra", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-09-25", text: "Puff pastry nya oke." }
    ]
  },
  {
    id: "s-trad-09",
    nama: "Tahu Isi Sayur",
    category: "Tradisional",
    desc: "Tahu goreng isi sayur, gurih dan renyah.",
    img: "/assets/Product/Satuan/Tradisional/tahu isi sayur.png",
    price: 10000,
    createdAt: "2024-02-11",
    stock: 200,
    sold: 610,
    reviews: [
      { id: "r-s-trad-09-1", name: "Irfan", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-02-18", text: "Praktis dan enak." }
    ]
  },
  {
    id: "s-trad-10",
    nama: "Doko-doko Cangkuli",
    category: "Tradisional",
    desc: "Kue tradisional cangkuli dengan tekstur kenyal.",
    img: "/assets/Product/Satuan/Tradisional/doko-doko cangkuli.png",
    price: 11000,
    createdAt: "2024-03-05",
    stock: 90,
    sold: 130,
    reviews: [
      { id: "r-s-trad-10-1", name: "Jamal", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-03-12", text: "Rasa tradisional yang otentik." }
    ]
  },
  {
    id: "s-trad-11",
    nama: "Doko-doko Pisang",
    category: "Tradisional",
    desc: "Varian doko-doko isi pisang manis.",
    img: "/assets/Product/Satuan/Tradisional/doko-doko pisang.png",
    price: 11000,
    createdAt: "2024-04-02",
    stock: 85,
    sold: 95,
    reviews: [
      { id: "r-s-trad-11-1", name: "Kamal", avatar: "/assets/avatars/avatar6.png", rating: 4, createdAt: "2024-04-10", text: "Enak, manisnya pas." }
    ]
  },
  {
    id: "s-trad-12",
    nama: "Tradisional Image 303",
    category: "Tradisional",
    desc: "Produk tradisional (image 303) — variasi kue lokal.",
    img: "/assets/Product/Satuan/Tradisional/image 303.png",
    price: 9000,
    createdAt: "2024-01-05",
    stock: 60,
    sold: 40,
    reviews: [
      { id: "r-s-trad-12-1", name: "Lulu", avatar: "/assets/avatars/avatar1.png", rating: 3, createdAt: "2024-01-10", text: "Coba variasinya, lumayan." }
    ]
  },

  /* ---------------------------
     PAKETAN - KUE (3)
     --------------------------- */
  {
    id: "p-kue-01",
    nama: "Kue Dos",
    category: "Kue",
    desc: "Paket kue dos komplit untuk acara kecil.",
    img: "/assets/Product/Paketan/Kue/kue dos.png",
    price: 250000,
    createdAt: "2024-05-01",
    stock: 20,
    sold: 40,
    reviews: [
      { id: "r-p-kue-01-1", name: "Widi", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-05-10", text: "Paket lengkap dan puas." }
    ]
  },
  {
    id: "p-kue-02",
    nama: "Kue Tampah",
    category: "Kue",
    desc: "Tampah kue berbagai jenis, cocok untuk hajatan.",
    img: "/assets/Product/Paketan/Kue/kue tampah.png",
    price: 450000,
    createdAt: "2024-06-15",
    stock: 12,
    sold: 18,
    reviews: [
      { id: "r-p-kue-02-1", name: "Yanti", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-06-20", text: "Hantaran cantik dan variatif." }
    ]
  },
  {
    id: "p-kue-03",
    nama: "Jajanan Paket",
    category: "Kue",
    desc: "Paket jajanan tradisional untuk acara komunitas.",
    img: "/assets/Product/Paketan/Kue/jajanan.png",
    price: 300000,
    createdAt: "2024-07-03",
    stock: 25,
    sold: 27,
    reviews: [
      { id: "r-p-kue-03-1", name: "Zulaikha", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-07-10", text: "Paketnya pas untuk acara kecil." }
    ]
  },

  /* ---------------------------
     PAKETAN - MAKANAN (11)
     --------------------------- */
  {
    id: "p-food-01",
    nama: "Nasi Dos",
    category: "Makanan",
    desc: "Box nasi dos untuk katering praktis.",
    img: "/assets/Product/Paketan/Makanan/nasi dos.png",
    price: 320000,
    createdAt: "2024-05-28",
    stock: 30,
    sold: 65,
    reviews: [
      { id: "r-p-food-01-1", name: "Asep", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-06-02", text: "Porsi cukup, nasi enak." }
    ]
  },
  {
    id: "p-food-02",
    nama: "Nasi Paru Rica",
    category: "Makanan",
    desc: "Paket nasi dengan paru rica rica pedas khas.",
    img: "/assets/Product/Paketan/Makanan/nasi paru rica.png",
    price: 380000,
    createdAt: "2024-04-18",
    stock: 18,
    sold: 22,
    reviews: [
      { id: "r-p-food-02-1", name: "Bram", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-04-25", text: "Rica nya nendang." }
    ]
  },
  {
    id: "p-food-03",
    nama: "Soto Ayam Paket",
    category: "Makanan",
    desc: "Paket soto ayam hangat untuk acara keluarga.",
    img: "/assets/Product/Paketan/Makanan/soto ayam.png",
    price: 280000,
    createdAt: "2024-03-20",
    stock: 22,
    sold: 40,
    reviews: [
      { id: "r-p-food-03-1", name: "Christ", avatar: "/assets/avatars/avatar1.png", rating: 4, createdAt: "2024-03-28", text: "Soto nya enak dan kuahnya gurih." }
    ]
  },
  {
    id: "p-food-04",
    nama: "Tampah Buah Segar",
    category: "Makanan",
    desc: "Tampah buah segar lengkap untuk acara.",
    img: "/assets/Product/Paketan/Makanan/tampah buah segar.png",
    price: 220000,
    createdAt: "2024-08-01",
    stock: 16,
    sold: 30,
    reviews: [
      { id: "r-p-food-04-1", name: "Dita", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-08-05", text: "Buahnya segar dan cantik disusun." }
    ]
  },
  {
    id: "p-food-05",
    nama: "Tampah Nasi Liwet",
    category: "Makanan",
    desc: "Tampah nasi liwet lengkap dengan lauk tradisional.",
    img: "/assets/Product/Paketan/Makanan/tampah nasi liwet.png",
    price: 420000,
    createdAt: "2024-06-10",
    stock: 10,
    sold: 14,
    reviews: [
      { id: "r-p-food-05-1", name: "Edi", avatar: "/assets/avatars/avatar3.png", rating: 5, createdAt: "2024-06-15", text: "Autentik dan enak." }
    ]
  },
  {
    id: "p-food-06",
    nama: "Tampah Rebusan",
    category: "Makanan",
    desc: "Tampah berisi aneka rebusan tradisional.",
    img: "/assets/Product/Paketan/Makanan/tampah rebusan.png",
    price: 330000,
    createdAt: "2024-05-02",
    stock: 12,
    sold: 20,
    reviews: [
      { id: "r-p-food-06-1", name: "Fauzi", avatar: "/assets/avatars/avatar4.png", rating: 4, createdAt: "2024-05-08", text: "Enak, porsi banyak." }
    ]
  },
  {
    id: "p-food-07",
    nama: "Tumpeng Nasi Kuning",
    category: "Makanan",
    desc: "Tumpeng nasi kuning lengkap untuk syukuran.",
    img: "/assets/Product/Paketan/Makanan/tumpeng nasi kuning.png",
    price: 650000,
    createdAt: "2024-07-22",
    stock: 6,
    sold: 9,
    reviews: [
      { id: "r-p-food-07-1", name: "Galih", avatar: "/assets/avatars/avatar5.png", rating: 5, createdAt: "2024-07-30", text: "Sesuai pesanan, rapi." }
    ]
  },
  {
    id: "p-food-08",
    nama: "Ayam Sambal Matah (Paket)",
    category: "Makanan",
    desc: "Paket ayam sambal matah segar dan pedas segar.",
    img: "/assets/Product/Paketan/Makanan/ayam sambal matah.png",
    price: 360000,
    createdAt: "2024-04-05",
    stock: 14,
    sold: 25,
    reviews: [
      { id: "r-p-food-08-1", name: "Hesti", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-04-12", text: "Sambal matahnya fresh." }
    ]
  },
  {
    id: "p-food-09",
    nama: "Box Nasi Liwet",
    category: "Makanan",
    desc: "Box nasi liwet individual, praktis untuk tamu.",
    img: "/assets/Product/Paketan/Makanan/box nasi liwet.png",
    price: 42000,
    createdAt: "2024-09-09",
    stock: 200,
    sold: 320,
    reviews: [
      { id: "r-p-food-09-1", name: "Icha", avatar: "/assets/avatars/avatar1.png", rating: 4, createdAt: "2024-09-12", text: "Praktis dan lezat." }
    ]
  },
  {
    id: "p-food-10",
    nama: "Nampan Rujak",
    category: "Makanan",
    desc: "Nampan rujak segar dengan bumbu kacang khas.",
    img: "/assets/Product/Paketan/Makanan/nampan rujak.png",
    price: 180000,
    createdAt: "2024-08-25",
    stock: 20,
    sold: 45,
    reviews: [
      { id: "r-p-food-10-1", name: "Jeni", avatar: "/assets/avatars/avatar2.png", rating: 5, createdAt: "2024-08-30", text: "Rasa rujaknya mantap." }
    ]
  },

  /* ---------------------------
     PAKETAN - MINUMAN (5)
     --------------------------- */
  {
    id: "p-drink-01",
    nama: "Es Melon",
    category: "Minuman",
    desc: "Es melon segar dengan potongan buah melon.",
    img: "/assets/Product/Paketan/Minuman/es melon.png",
    price: 45000,
    createdAt: "2024-06-01",
    stock: 80,
    sold: 120,
    reviews: [
      { id: "r-p-drink-01-1", name: "Kevin", avatar: "/assets/avatars/avatar3.png", rating: 4, createdAt: "2024-06-07", text: "Segar dan manis pas." }
    ]
  },
  {
    id: "p-drink-02",
    nama: "Es Pisang Ijo",
    category: "Minuman",
    desc: "Es pisang ijo khas, manis dan legit.",
    img: "/assets/Product/Paketan/Minuman/es pisang ijo.png",
    price: 38000,
    createdAt: "2024-05-10",
    stock: 70,
    sold: 90,
    reviews: [
      { id: "r-p-drink-02-1", name: "Lina", avatar: "/assets/avatars/avatar4.png", rating: 5, createdAt: "2024-05-15", text: "Rasa tradisional yang otentik." }
    ]
  },
  {
    id: "p-drink-03",
    nama: "Es Buah Naga",
    category: "Minuman",
    desc: "Es buah segar dengan potongan buah naga dan lainnya.",
    img: "/assets/Product/Paketan/Minuman/es buah naga.png",
    price: 48000,
    createdAt: "2024-07-14",
    stock: 60,
    sold: 72,
    reviews: [
      { id: "r-p-drink-03-1", name: "Miko", avatar: "/assets/avatars/avatar5.png", rating: 4, createdAt: "2024-07-20", text: "Manis dan segar." }
    ]
  },
  {
    id: "p-drink-04",
    nama: "Es Campur",
    category: "Minuman",
    desc: "Es campur lengkap dengan agar, buah, dan serutan es.",
    img: "/assets/Product/Paketan/Minuman/es campur.png",
    price: 42000,
    createdAt: "2024-03-30",
    stock: 100,
    sold: 210,
    reviews: [
      { id: "r-p-drink-04-1", name: "Nurfah", avatar: "/assets/avatars/avatar6.png", rating: 5, createdAt: "2024-04-05", text: "Pilihan es campur terbaik." }
    ]
  },
  {
    id: "p-drink-05",
    nama: "Es Cincau",
    category: "Minuman",
    desc: "Es cincau segar dengan sirup gula aren.",
    img: "/assets/Product/Paketan/Minuman/es cincau.png",
    price: 35000,
    createdAt: "2024-02-18",
    stock: 120,
    sold: 340,
    reviews: [
      { id: "r-p-drink-05-1", name: "Omar", avatar: "/assets/avatars/avatar1.png", rating: 4, createdAt: "2024-02-25", text: "Cincau lembut, manis pas." }
    ]
  }
];

export { products };