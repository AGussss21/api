-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Des 2025 pada 03.46
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lolacake_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `business_info`
--

CREATE TABLE `business_info` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `hours` varchar(100) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lat` decimal(10,7) DEFAULT 0.0000000,
  `lng` decimal(10,7) DEFAULT 0.0000000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `business_info`
--

INSERT INTO `business_info` (`id`, `name`, `description`, `phone`, `email`, `address`, `hours`, `instagram`, `facebook`, `created_at`, `updated_at`, `lat`, `lng`) VALUES
(1, 'lolacake', '', '0831252723', 'lolacake@gmail.com', 'Jl. Sapati No.19, Kendari, Sulawesi Tenggara', '1212', '', '', '2025-12-09 23:32:50', '2025-12-10 01:57:19', -7.3093474, 112.7842710);

-- --------------------------------------------------------

--
-- Struktur dari tabel `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `type` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `slug` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `type`, `description`, `price`, `stock`, `image`, `created_at`, `slug`) VALUES
(32, 'Roti Coklat', 'Cake', 'satuan', 'Roti lembut berisi coklat leleh, cocok untuk sarapan atau camilan.', 18000.00, 151, '/uploads/products/roti coklat.png', '2025-12-10 04:30:49', 'roti-coklat-32'),
(33, 'Roti Keju', 'Bread', 'satuan', 'Roti isi keju serut, gurih dan ', 20000.00, 90, '/uploads/products/roti keju.png', '2025-12-10 04:30:49', 'roti-keju'),
(34, 'Roti Pisang Coklat', 'Bread', 'satuan', 'Roti isi pisang dan coklat, paduan manis dan lembut.', 19000.00, 70, '/uploads/products/roti pisang coklat.png', '2025-12-10 04:30:49', 'roti-pisang-coklat'),
(35, 'Roti Sosis', 'Bread', 'satuan', 'Roti lapis sosis, favorit anak-anak untuk bekal.', 22000.00, 150, '/uploads/products/roti sosis.png', '2025-12-10 04:30:49', 'roti-sosis'),
(36, 'Good Time', 'Cookie', 'satuan', 'Cookie klasik Good Time, renyah dengan coklat serut.', 7000.00, 400, '/uploads/products/good time.png', '2025-12-10 04:30:49', 'good-time'),
(37, 'Cookie Image 321', 'Cookie', 'satuan', 'Cookie spesial dengan topping unik (image 321).', 9000.00, 200, '/uploads/products/image 321.png', '2025-12-10 04:30:49', 'cookie-image-321'),
(38, 'Kastangel', 'Cookie', 'satuan', 'Kue kastangel gurih berbahan keju premium.', 25000.00, 180, '/uploads/products/kastangel.png', '2025-12-10 04:30:49', 'kastangel'),
(39, 'Nastar Durian', 'Cookie', 'satuan', 'Nastar isi durian, aroma khas dan legit.', 27000.00, 120, '/uploads/products/nastar durian.png', '2025-12-10 04:30:49', 'nastar-durian'),
(40, 'Nastar Keranjang', 'Cookie', 'satuan', 'Nastar klasik disajikan dalam bentuk keranjang lucu.', 26000.00, 90, '/uploads/products/nastar keranjang.png', '2025-12-10 04:30:49', 'nastar-keranjang'),
(41, 'Nutella Cookie', 'Cookie', 'satuan', 'Cookie lembut berisi selai Nutella yang lumer.', 10000.00, 220, '/uploads/products/nutella.png', '2025-12-10 04:30:49', 'nutella-cookie'),
(42, 'Putri Salju Pandan', 'Cookie', 'satuan', 'Putri salju rasa pandan, lembut dan harum.', 12000.00, 140, '/uploads/products/putri salju pandan.png', '2025-12-10 04:30:49', 'putri-salju-pandan'),
(43, 'Putri Salju', 'Cookie', 'satuan', 'Putri salju klasik, taburan gula halus yang lembut.', 11000.00, 160, '/uploads/products/putri salju.png', '2025-12-10 04:30:49', 'putri-salju'),
(44, 'Rambutan Coklat', 'Cookie', 'satuan', 'Cookie unik berbentuk rambutan dengan coklat topping.', 9000.00, 80, '/uploads/products/rambutan coklat.png', '2025-12-10 04:30:49', 'rambutan-coklat'),
(45, 'Stik Coklat', 'Cookie', 'satuan', 'Stik coklat renyah, cocok untuk teman minum teh.', 8000.00, 300, '/uploads/products/stik coklat.png', '2025-12-10 04:30:49', 'stik-coklat'),
(46, 'Thumbprint Strawberry', 'Cookie', 'satuan', 'Kue kering thumbprint dengan selai stroberi khas.', 13000.00, 110, '/uploads/products/thumprint strawberry.png', '2025-12-10 04:30:49', 'thumbprint-strawberry'),
(47, 'Choco Chips', 'Cookie', 'satuan', 'Classic choco chips cookie, renyah dan penuh coklat.', 9000.00, 260, '/uploads/products/choco chips.png', '2025-12-10 04:30:49', 'choco-chips'),
(48, 'Pudding Buah', 'Dessert', 'satuan', 'Pudding lembut dengan potongan buah segar.', 15000.00, 140, '/uploads/products/pudding buah.png', '2025-12-10 04:30:49', 'pudding-buah'),
(49, 'Pudding Caramel', 'Dessert', 'satuan', 'Pudding klasik dengan karamel lembut.', 15000.00, 100, '/uploads/products/pudding caramel.png', '2025-12-10 04:30:49', 'pudding-caramel'),
(50, 'Pudding Coklat', 'Dessert', 'satuan', 'Pudding rasa coklat intens untuk pencinta coklat.', 16000.00, 130, '/uploads/products/pudding coklat.png', '2025-12-10 04:30:49', 'pudding-coklat'),
(51, 'Pudding Crispy', 'Dessert', 'satuan', 'Pudding dengan topping renyah untuk tekstur kontras.', 17000.00, 90, '/uploads/products/pudding crispy.png', '2025-12-10 04:30:49', 'pudding-crispy'),
(52, 'Pudding Dodol', 'Dessert', 'satuan', 'Kreasi pudding berpadu rasa dodol tradisional.', 17000.00, 70, '/uploads/products/pudding dodol.png', '2025-12-10 04:30:49', 'pudding-dodol'),
(53, 'Pudding Negro', 'Dessert', 'satuan', 'Pudding dark chocolate (negro) bernuansa intens.', 18000.00, 60, '/uploads/products/pudding negro.png', '2025-12-10 04:30:49', 'pudding-negro'),
(54, 'Pudding Batik', 'Dessert', 'satuan', 'Pudding dekoratif motif batik untuk hadiah spesial.', 22000.00, 40, '/uploads/products/pudding batik.png', '2025-12-10 04:30:49', 'pudding-batik'),
(55, 'Donat Keju Serut', 'Donut', 'satuan', 'Donat dengan topping keju serut yang gurih.', 8000.00, 300, '/uploads/products/donat keju serut.png', '2025-12-10 04:30:49', 'donat-keju-serut'),
(56, 'Donat Messes Coklat', 'Donut', 'satuan', 'Donat bertabur coklat messes manis.', 8000.00, 240, '/uploads/products/donat messes coklat.png', '2025-12-10 04:30:49', 'donat-messes-coklat'),
(57, 'Donat Oreo', 'Donut', 'satuan', 'Donat dengan remahan Oreo di atasnya.', 9000.00, 200, '/uploads/products/donat oreo.png', '2025-12-10 04:30:49', 'donat-oreo'),
(58, 'Donat Strawberry Choco Crunch', 'Donut', 'satuan', 'Perpaduan strawberry dan choco crunchy.', 9500.00, 150, '/uploads/products/donat strawberry choco crunch.png', '2025-12-10 04:30:49', 'donat-strawberry-choco-crunch'),
(59, 'Donat Tiramisu', 'Donut', 'satuan', 'Donat rasa tiramisu, elegan dan lembut.', 12000.00, 80, '/uploads/products/donat tiramisu.png', '2025-12-10 04:30:49', 'donat-tiramisu'),
(60, 'Donat Coklat Drizzle', 'Donut', 'satuan', 'Donat dilapisi coklat drizzle, cocok untuk pecinta coklat.', 8500.00, 210, '/uploads/products/donat coklat drizzle.png', '2025-12-10 04:30:49', 'donat-coklat-drizzle'),
(61, 'Donat Gula Salju', 'Donut', 'satuan', 'Donat manis berlapis gula halus ala salju.', 7000.00, 350, '/uploads/products/donat gula salju.png', '2025-12-10 04:30:49', 'donat-gula-salju'),
(62, 'Donat Kacang Crunch', 'Donut', 'satuan', 'Donat topping kacang renyah untuk tekstur ekstra.', 9500.00, 160, '/uploads/products/donat kacang crunch.png', '2025-12-10 04:30:49', 'donat-kacang-crunch'),
(63, 'Bolu Gulung', 'Cake', 'satuan', 'Bolu gulung klasik dengan isian krim lembut.', 65000.00, 40, '/uploads/products/bolu gulung.png', '2025-12-10 04:30:49', 'bolu-gulung'),
(64, 'Bolu Keju (besar)', 'Cake', 'satuan', 'Bolu keju ukuran besar dengan keju asli.', 120000.00, 25, '/uploads/products/bolu keju.png', '2025-12-10 04:30:49', 'bolu-keju-(besar)'),
(65, 'Bolu Lapis Surabaya', 'Cake', 'satuan', 'Kue lapis surabaya tradisional, moist dan legit.', 140000.00, 15, '/uploads/products/bolu lapis surabaya.png', '2025-12-10 04:30:49', 'bolu-lapis-surabaya'),
(66, 'Bolu Pandan', 'Cake', 'satuan', 'Bolu pandan wangi dengan tekstur lembut.', 70000.00, 60, '/uploads/products/bolu pandan.png', '2025-12-10 04:30:49', 'bolu-pandan'),
(67, 'Bolu Pisang', 'Cake', 'satuan', 'Bolu pisang moist dengan rasa pisang natural.', 68000.00, 55, '/uploads/products/bolu pisang.png', '2025-12-10 04:30:49', 'bolu-pisang'),
(68, 'Bolu Zebra', 'Cake', 'satuan', 'Bolu zebra klasik dengan lapisan coklat-vanila.', 75000.00, 70, '/uploads/products/bolu zebra.png', '2025-12-10 04:30:49', 'bolu-zebra'),
(69, 'Brownies Coklat', 'Cake', 'satuan', 'Brownies coklat fudgy dengan tekstur lembab.', 85000.00, 40, '/uploads/products/brownies coklat.png', '2025-12-10 04:30:49', 'brownies-coklat'),
(70, 'Bolu Caramel', 'Cake', 'satuan', 'Bolu dengan lapisan caramel lembut.', 78000.00, 30, '/uploads/products/bolu caramel.png', '2025-12-10 04:30:49', 'bolu-caramel'),
(71, 'Bolu Cuke', 'Cake', 'satuan', 'Cake khas \'cuke\' (varian lokal) dengan rasa khas.', 70000.00, 20, '/uploads/products/bolu cuke.png', '2025-12-10 04:30:49', 'bolu-cuke'),
(72, 'Bolu Gula Merah', 'Cake', 'satuan', 'Bolu dengan gula merah alami, aroma karamel tradisional.', 72000.00, 35, '/uploads/products/bolu gula merah.png', '2025-12-10 04:30:49', 'bolu-gula-merah'),
(73, 'Jalangkote', 'Tradisional', 'satuan', 'Jalangkote khas, isian gurih pedas manis.', 15000.00, 120, '/uploads/products/jalangkote.png', '2025-12-10 04:30:49', 'jalangkote'),
(74, 'Pai Buah', 'Tradisional', 'satuan', 'Pai buah segar dengan kulit renyah.', 18000.00, 80, '/uploads/products/pai buah.png', '2025-12-10 04:30:49', 'pai-buah'),
(75, 'Pai Susu', 'Tradisional', 'satuan', 'Pai susu klasik manis lembut.', 16000.00, 90, '/uploads/products/pai susu.png', '2025-12-10 04:30:49', 'pai-susu'),
(76, 'Panada', 'Tradisional', 'satuan', 'Panada isi ikan yang gurih dan pedas.', 17000.00, 100, '/uploads/products/panada.png', '2025-12-10 04:30:49', 'panada'),
(77, 'Risol Mayo', 'Tradisional', 'satuan', 'Risol isi mayones dan sayur, gurih lembut.', 12000.00, 140, '/uploads/products/risol mayo.png', '2025-12-10 04:30:49', 'risol-mayo'),
(78, 'Risoles', 'Tradisional', 'satuan', 'Risoles renyah dengan isi sayur dan daging cincang.', 13000.00, 160, '/uploads/products/risoles.png', '2025-12-10 04:30:49', 'risoles'),
(79, 'Sus Buah', 'Tradisional', 'satuan', 'Sus berisi krim dan buah segar, manis dan lembut.', 20000.00, 70, '/uploads/products/sus buah.png', '2025-12-10 04:30:49', 'sus-buah'),
(80, 'Sus', 'Tradisional', 'satuan', 'Sus polos klasik untuk cemilan manis.', 12000.00, 110, '/uploads/products/sus.png', '2025-12-10 04:30:49', 'sus'),
(81, 'Tahu Isi Sayur', 'Tradisional', 'satuan', 'Tahu goreng isi sayur, gurih dan renyah.', 10000.00, 200, '/uploads/products/tahu isi sayur.png', '2025-12-10 04:30:49', 'tahu-isi-sayur'),
(82, 'Doko-doko Cangkuli', 'Tradisional', 'satuan', 'Kue tradisional cangkuli dengan tekstur kenyal.', 11000.00, 90, '/uploads/products/doko-doko cangkuli.png', '2025-12-10 04:30:49', 'doko-doko-cangkuli'),
(83, 'Doko-doko Pisang', 'Tradisional', 'satuan', 'Varian doko-doko isi pisang manis.', 11000.00, 85, '/uploads/products/doko-doko pisang.png', '2025-12-10 04:30:49', 'doko-doko-pisang'),
(84, 'Tradisional Image 303', 'Tradisional', 'satuan', 'Produk tradisional (image 303) — variasi kue lokal.', 9000.00, 60, '/uploads/products/image 303.png', '2025-12-10 04:30:49', 'tradisional-image-303'),
(85, 'Kue Dos', 'Kue', 'satuan', 'Paket kue dos komplit untuk acara kecil.', 250000.00, 20, '/uploads/products/kue dos.png', '2025-12-10 04:30:49', 'kue-dos'),
(86, 'Kue Tampah', 'Kue', 'satuan', 'Tampah kue berbagai jenis, cocok untuk hajatan.', 450000.00, 12, '/uploads/products/kue tampah.png', '2025-12-10 04:30:49', 'kue-tampah'),
(87, 'Jajanan Paket', 'Kue', 'satuan', 'Paket jajanan tradisional untuk acara komunitas.', 300000.00, 25, '/uploads/products/jajanan.png', '2025-12-10 04:30:49', 'jajanan-paket'),
(88, 'Nasi Dos', 'Makanan', 'satuan', 'Box nasi dos untuk katering praktis.', 320000.00, 30, '/uploads/products/nasi dos.png', '2025-12-10 04:30:49', 'nasi-dos'),
(89, 'Nasi Paru Rica', 'Makanan', 'satuan', 'Paket nasi dengan paru rica rica pedas khas.', 380000.00, 18, '/uploads/products/nasi paru rica.png', '2025-12-10 04:30:49', 'nasi-paru-rica'),
(90, 'Soto Ayam Paket', 'Makanan', 'satuan', 'Paket soto ayam hangat untuk acara keluarga.', 280000.00, 22, '/uploads/products/soto ayam.png', '2025-12-10 04:30:49', 'soto-ayam-paket'),
(91, 'Tampah Buah Segar', 'Makanan', 'satuan', 'Tampah buah segar lengkap untuk acara.', 220000.00, 16, '/uploads/products/tampah buah segar.png', '2025-12-10 04:30:49', 'tampah-buah-segar'),
(92, 'Tampah Nasi Liwet', 'Makanan', 'satuan', 'Tampah nasi liwet lengkap dengan lauk tradisional.', 420000.00, 10, '/uploads/products/tampah nasi liwet.png', '2025-12-10 04:30:49', 'tampah-nasi-liwet'),
(93, 'Tampah Rebusan', 'Makanan', 'satuan', 'Tampah berisi aneka rebusan tradisional.', 330000.00, 12, '/uploads/products/tampah rebusan.png', '2025-12-10 04:30:49', 'tampah-rebusan'),
(94, 'Tumpeng Nasi Kuning', 'Makanan', 'satuan', 'Tumpeng nasi kuning lengkap untuk syukuran.', 650000.00, 6, '/uploads/products/tumpeng nasi kuning.png', '2025-12-10 04:30:49', 'tumpeng-nasi-kuning'),
(95, 'Ayam Sambal Matah (Paket)', 'Makanan', 'satuan', 'Paket ayam sambal matah segar dan pedas segar.', 360000.00, 14, '/uploads/products/ayam sambal matah.png', '2025-12-10 04:30:49', 'ayam-sambal-matah-(paket)'),
(96, 'Box Nasi Liwet', 'Makanan', 'satuan', 'Box nasi liwet individual, praktis untuk tamu.', 42000.00, 200, '/uploads/products/box nasi liwet.png', '2025-12-10 04:30:49', 'box-nasi-liwet'),
(97, 'Nampan Rujak', 'Makanan', 'satuan', 'Nampan rujak segar dengan bumbu kacang khas.', 180000.00, 20, '/uploads/products/nampan rujak.png', '2025-12-10 04:30:49', 'nampan-rujak'),
(98, 'Es Melon', 'Minuman', 'satuan', 'Es melon segar dengan potongan buah melon.', 45000.00, 80, '/uploads/products/es melon.png', '2025-12-10 04:30:49', 'es-melon'),
(99, 'Es Pisang Ijo', 'Minuman', 'satuan', 'Es pisang ijo khas, manis dan legit.', 38000.00, 70, '/uploads/products/es pisang ijo.png', '2025-12-10 04:30:49', 'es-pisang-ijo'),
(100, 'Es Buah Naga', 'Minuman', 'satuan', 'Es buah segar dengan potongan buah naga dan lainnya.', 48000.00, 60, '/uploads/products/es buah naga.png', '2025-12-10 04:30:49', 'es-buah-naga'),
(101, 'Es Campur', 'Minuman', 'satuan', 'Es campur lengkap dengan agar, buah, dan serutan es.', 42000.00, 100, '/uploads/products/es campur.png', '2025-12-10 04:30:49', 'es-campur'),
(102, 'Es Cincau', 'Minuman', 'satuan', 'Es cincau segar dengan sirup gula aren.', 35000.00, 120, '/uploads/products/es cincau.png', '2025-12-10 04:30:49', 'es-cincau'),
(103, 'Roti Coklat', 'Cake', 'satuan', 'Roti lembut berisi coklat leleh, cocok untuk sarapan yang enak', 18000.00, 163, NULL, '2025-12-10 04:58:39', NULL),
(104, 'Roti Coklat', 'Cake', 'satuan', 'Roti lembut berisi coklat leleh, cocok untuk sarapan yang enak', 18000.00, 194, NULL, '2025-12-11 09:52:44', NULL),
(160, 'Brownies Premium', 'Cake', 'satuan', 'asdasdasda', 120.00, 0, '/uploads/products/1765494780876.png', '2025-12-11 23:13:00', NULL),
(161, 'Brownies Premium', 'Cake', 'satuan', 'enak banget', 120.00, 120, NULL, '2025-12-11 23:19:26', NULL),
(162, 'Brownies Premium', 'Cake', 'satuan', 'asdasdasdas', 120.00, 120, NULL, '2025-12-11 23:26:16', NULL),
(163, 'Roti Coklat', 'Cake', 'satuan', 'mantab', 1200.00, 10, '/uploads/products/1765496304941.png', '2025-12-11 23:38:24', NULL),
(164, 'roti bolu', 'Cake', 'satuan', 'asdasdas', 1200.00, 1, '/uploads/products/1765496393685.png', '2025-12-11 23:39:53', NULL),
(165, 'Roti Coklat', 'Cake', 'satuan', 'asdasdasda', 120.00, 2, '/uploads/products/1765496611644.png', '2025-12-11 23:43:31', NULL),
(166, 'Roti Coklat', 'Cake', 'satuan', 'sdadasdas', 120.00, 12, '/uploads/products/1765497208191.png', '2025-12-11 23:53:28', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_updates`
--

CREATE TABLE `product_updates` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stock_add` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','approved','rejected') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product_updates`
--

INSERT INTO `product_updates` (`id`, `product_id`, `name`, `category`, `type`, `price`, `description`, `stock_add`, `image`, `status`, `created_at`, `updated_at`) VALUES
(25, 160, 'Brownies Premium', 'Cake', 'satuan', 120.00, 'asdasdasda', 0, '/uploads/products/1765494780876.png', 'draft', '2025-12-11 23:13:00', '2025-12-11 23:13:00'),
(26, 161, 'Brownies Premium', 'Cake', 'satuan', 120.00, 'enak banget', 0, NULL, 'draft', '2025-12-11 23:19:26', '2025-12-11 23:19:26'),
(27, 161, 'Brownies Premium', 'Cake', 'satuan', 120.00, 'enak banget', 120, NULL, 'draft', '2025-12-11 23:21:39', '2025-12-11 23:21:39'),
(28, 162, 'Brownies Premium', 'Cake', 'satuan', 120.00, 'asdasdasdas', 120, NULL, 'draft', '2025-12-11 23:26:16', '2025-12-11 23:26:16'),
(29, 163, 'Roti Coklat', 'Cake', 'satuan', 1200.00, 'mantab', 10, '/uploads/products/1765496304941.png', 'draft', '2025-12-11 23:38:24', '2025-12-11 23:38:24'),
(30, 164, 'roti bolu', 'Cake', 'satuan', 1200.00, 'asdasdas', 1, '/uploads/products/1765496393685.png', 'draft', '2025-12-11 23:39:53', '2025-12-11 23:39:53'),
(31, 165, 'Roti Coklat', 'Cake', 'satuan', 120.00, 'asdasdasda', 2, '/uploads/products/1765496611644.png', 'draft', '2025-12-11 23:43:31', '2025-12-11 23:43:31'),
(32, 166, 'Roti Coklat', 'Cake', 'satuan', 120.00, 'sdadasdas', 12, '/uploads/products/1765497208191.png', 'draft', '2025-12-11 23:53:28', '2025-12-11 23:53:28'),
(33, 167, 'Roti Coklat', 'Cake', 'satuan', 13.00, 'adsadas', 2, NULL, 'draft', '2025-12-12 00:01:17', '2025-12-12 00:01:17'),
(34, 168, 'Brownies Premium', 'Cake', 'satuan', 12.00, 'asdasdasd', 12, '/uploads/products/1765498581671.png', 'draft', '2025-12-12 00:16:21', '2025-12-12 00:16:21'),
(35, 169, 'roti bolu', 'Cake', 'satuan', 1200.00, 'asdasdasdsa', 12, '/uploads/products/1765499804212.png', 'draft', '2025-12-12 00:36:44', '2025-12-12 00:36:44'),
(36, 169, 'roti bolu', 'Cake', 'satuan', 1200.00, 'asdasdasdsa', 0, '/uploads/products/1765500257179.png', 'draft', '2025-12-12 00:44:17', '2025-12-12 00:44:17'),
(37, 169, 'roti bolu', 'Cake', 'satuan', 1200.00, 'asdasdasdsa', 0, '/uploads/products/1765500286020.png', 'draft', '2025-12-12 00:44:46', '2025-12-12 00:44:46'),
(38, 169, 'roti bolu', 'Cake', 'satuan', 1200.00, 'asdasdasdsa', 12, '/uploads/products/1765500286020.png', 'draft', '2025-12-12 00:47:54', '2025-12-12 00:47:54'),
(39, 170, 'Brownies Premium', 'Cake', 'satuan', 12000.00, 'sdasdasdasd', 10, NULL, 'draft', '2025-12-12 00:48:30', '2025-12-12 00:48:30'),
(40, 167, 'Roti Coklat', 'Cake', 'satuan', 2000.00, 'adsadas', 13, NULL, 'draft', '2025-12-12 01:06:48', '2025-12-12 01:06:48'),
(41, 174, 'Roti Coklat', 'Cake', 'satuan', 120.00, 'asdasdasdas', 3, '/uploads/products/1765552266816.png', 'draft', '2025-12-12 01:11:15', '2025-12-12 01:11:15'),
(42, 175, 'roti', 'Cake', 'satuan', 12.00, 'asdasdas', 5, '/uploads/products/1765935444672.png', 'draft', '2025-12-12 01:12:42', '2025-12-12 01:12:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `products_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `fullname`, `username`, `email`, `phone`, `password`, `role`, `created_at`, `is_verified`, `verification_token`, `reset_token`, `reset_token_expires`, `profile_photo`, `otp`, `otp_expires`) VALUES
(5, '', 'agus2', 'agus2@example.com', NULL, '$2b$10$/uSc31RF.JgjMxpKuPIeBeB6DSbkB8Mpc1t6BKhE3sjQ41s/0d3ZC', 'customer', '2025-11-11 03:08:20', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(10, '', 'agus', 'agus3@example.com', NULL, '$2b$10$qrMaP3uQy/fP4tysNuwdPeYNlt8/QEs9soAvzUajNfP/tfIEWbDea', 'customer', '2025-11-12 16:34:07', 0, '1052467c116ebc48a787b89531edd968014654f6ae45c892b2121a93fc97ae91', NULL, NULL, NULL, NULL, NULL),
(11, '', 'agus', 'agus.22153@mhs.unesa.ac.id', NULL, '$2b$10$1kNhjAhn3eFSMHjFC/Td0.5FCXN/23R2dJQjYxgOMbP0CbLMED.02', 'customer', '2025-11-12 16:34:43', 0, '13efc664fba5a11638f7f701fc31edc32f891800acdb911d15ad5a969d7262c4', NULL, NULL, NULL, NULL, NULL),
(40, '', 'ara', 'mutiaranurzarima@gmail.com', NULL, '$2b$10$Q.LtTXQRPZKb0Kipt7cvTOp0sZSr.m3G1qwDL0koOG7qz44p91Yha', 'customer', '2025-12-02 19:04:15', 1, NULL, NULL, NULL, NULL, NULL, NULL),
(43, '', 'superadmin', 'admin@lolacake.com', NULL, '$2b$10$LuisRpN0mbsaFT9weUyj.eS/RfI2ZLfo57QqNu2FqpFcDQ7zz60mS', 'admin', '2025-12-03 11:54:08', 1, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'mutiara', 'ara2', 'aracannss@gmail.com', '081231930522', '$2b$10$ZrUwfVik9T3XAGa.d70/h.ao3FiTCPIzOQmXIbLZeCFWaIs8uTQ6', 'customer', '2025-12-03 13:03:41', 1, NULL, 'abc123', '2025-12-04 12:00:00', '/uploads/profile/user_44.jpeg', NULL, NULL),
(47, 'noren', 'agus', 'noren4039@gmail.com', '085707695998', '$2b$10$Rzag37/T1FF.hxmB4pkCJOdSeX11h3seqx48wZgCS6wgWFBAESRH2', 'customer', '2025-12-04 22:01:18', 1, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `business_info`
--
ALTER TABLE `business_info`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `product_updates`
--
ALTER TABLE `product_updates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_update_product` (`product_id`);

--
-- Indeks untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_testimonials_products` (`products_id`),
  ADD KEY `fk_testimonials_users` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_product_id` (`products_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `business_info`
--
ALTER TABLE `business_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT untuk tabel `product_updates`
--
ALTER TABLE `product_updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `fk_testimonials_products` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_testimonials_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
