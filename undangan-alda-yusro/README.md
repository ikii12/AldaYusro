# Undangan Digital Alda & Yusro

Undangan pernikahan berbasis HTML + CSS + JavaScript.
Sabtu, 12 Desember 2026 · Kp. Muncung, Tigaraksa, Kab. Tangerang.

## Struktur folder

```
undangan-alda-yusro/
├── index.html                 ← halaman utama (semua teks undangan ada di sini)
├── README.md
├── backend/google-apps-script.gs  ← kode penyimpan RSVP & ucapan ke Google Sheets
└── assets/
    ├── css/style.css          ← warna, font, tata letak
    ├── js/main.js             ← cover, musik, countdown, animasi (CONFIG di baris atas)
    ├── audio/lagu.mp3         ← lagu latar
    ├── lottie/heart.js        ← animasi Lottie (hati berdenyut)
    ├── images/
    │   ├── bunga-sudut.svg    ← ornamen bunga pojok
    │   ├── mawar.svg          ← ornamen mawar kecil
    │   ├── qr-lokasi.png      ← QR code Google Maps lokasi
    │   └── gallery/foto-1.jpg, foto-2.jpg  ← 2 foto prewedding (masih contoh)
    └── vendor/                ← library: GSAP, ScrollTrigger, AOS, Animate.css, Swiper, Lottie
```

Semua library sudah disimpan di folder `vendor`, jadi tidak bergantung pada CDN.
Hanya font (Google Fonts) dan peta (Google Maps) yang butuh internet.

## Cara membuka

Klik dua kali `index.html`, atau lebih baik jalankan lewat server lokal
(misalnya ekstensi **Live Server** di VS Code).

## Nama tamu personal

Tambahkan `?to=` di akhir link. Spasi ditulis `+` atau `%20`:

```
https://domain-anda.com/?to=Bapak+Budi+%26+Keluarga
```

Tanpa `?to=`, cover menampilkan "Tamu Undangan".

## Yang perlu diganti

| Yang diganti | Caranya |
|---|---|
| Lagu | Timpa `assets/audio/lagu.mp3` dengan lagu pilihan (nama file tetap `lagu.mp3`). Lagu bawaan hanya instrumental contoh. |
| Foto galeri | Timpa `assets/images/gallery/foto-1.jpg` dan `foto-2.jpg` (disarankan potret 4:5, sekitar 800×1000 px). Untuk menambah foto, salin satu baris `swiper-slide` di `index.html`. |
| Foto mempelai | Di `index.html`, ganti `<span class="person__initial">A</span>` dengan `<img src="assets/images/alda.jpg" alt="Alda">` (begitu juga untuk Yusro). |
| Tanggal / jam | `CONFIG` di atas `assets/js/main.js` (untuk countdown & kalender) dan teks di `index.html`. |
| Logo BCA | Otomatis memakai logo resmi dari Wikimedia Commons saat online. Agar tidak bergantung ke situs luar, unduh logo BCA dan simpan sebagai `assets/images/logo-bca.png`. |
| No. rekening | Di `index.html` bagian AMPLOP DIGITAL: ubah `data-rek` (yang disalin) dan teks nomornya (yang ditampilkan). |
| Warna | Variabel `:root` di atas `assets/css/style.css`. |

## Fitur

- Cover "Buka Undangan" dengan efek tirai (GSAP timeline)
- Lagu otomatis diputar setelah tombol dibuka, tombol jeda/putar melayang, otomatis jeda saat pindah tab
- Animasi saat scroll (AOS), parallax ornamen bunga (GSAP ScrollTrigger)
- Animate.css pada teks cover, kelopak bunga berjatuhan, titik emas berkelip
- Countdown ke 12 Desember 2026 pukul 10.00 WIB
- Peta Google Maps, tombol buka Maps, dan QR code lokasi
- Tombol "Simpan ke Kalender" (Google Calendar)
- Galeri foto Swiper (coverflow, autoplay)
- Amplop digital: kartu rekening BCA a.n. Muh Yusro dengan tombol salin nomor rekening
- RSVP & ucapan: form nama, ucapan, konfirmasi kehadiran, statistik Hadir/Tidak/Ragu, popup terima kasih dengan animasi centang dan hati memancar
- Animasi Lottie hati di bagian penutup

> Browser memblokir lagu yang diputar sebelum pengunjung berinteraksi. Karena itu musik
> baru menyala setelah tombol **Buka Undangan** diklik. Ini perilaku normal semua undangan digital.

## Menghubungkan RSVP ke Google Sheets

Tanpa langkah ini, form tetap jalan dalam **mode contoh**: ucapan hanya tersimpan di browser si pengirim
dan tidak terlihat oleh tamu lain. Agar semua ucapan terkumpul dan tampil untuk semua orang:

1. Buka sheets.google.com, buat spreadsheet kosong (misalnya "RSVP Alda & Yusro").
2. Klik **Extensions > Apps Script**. Hapus kode bawaan, tempel seluruh isi `backend/google-apps-script.gs`, klik Save.
3. Klik **Deploy > New deployment**. Pilih jenis **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik Deploy, lalu **Authorize access** dan pilih akun Google kamu.
   Jika muncul "Google hasn't verified this app", klik **Advanced > Go to ... (unsafe)**. Ini normal karena script buatan sendiri.
5. Salin **Web app URL** (berakhiran `/exec`).
6. Buka `assets/js/main.js`, tempel URL itu di `CONFIG.urlUcapan`:
   ```js
   urlUcapan: "https://script.google.com/macros/s/XXXX/exec",
   ```
7. Upload ulang `main.js` ke GitHub. Semua ucapan akan masuk ke sheet "Ucapan" dan bisa dihapus langsung dari sheet jika ada yang tidak pantas.

> Jika kode Apps Script diubah, lakukan **Deploy > Manage deployments > Edit > Version: New version** agar perubahan berlaku.

## Hosting gratis

1. **Netlify Drop**: buka app.netlify.com/drop, seret folder `undangan-alda-yusro`, selesai.
2. **Vercel** atau **GitHub Pages**: unggah isi folder ini sebagai repository.
