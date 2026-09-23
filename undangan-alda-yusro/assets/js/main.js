/* ==========================================================
   Undangan Pernikahan Alda & Yusro
   Semua data yang sering diganti ada di CONFIG di bawah.
   ========================================================== */

const CONFIG = {
  // Waktu acara (WIB = UTC+07:00), dipakai untuk countdown & kalender
  tanggalAcara: "2026-12-12T10:00:00+07:00",
  selesaiAcara: "2026-12-12T14:00:00+07:00",
  judulKalender: "Pernikahan Alda & Yusro",
  lokasi: "Kp. Muncung RT.002/002, Ds. Bantar Panjang, Kec. Tigaraksa, Kab. Tangerang",
  linkMaps: "https://maps.app.goo.gl/bXVFzw9ABToqtevJA",
  // URL Web App Google Apps Script untuk menyimpan ucapan & RSVP ke Google Sheets.
  // Kosongkan ("") untuk mode contoh: ucapan hanya tersimpan di browser pengirim.
  urlUcapan: "https://script.google.com/macros/s/AKfycbzrI_7pXoLNNYN9fhx9w559IKWd2v026u_uenp-eKJZh7cLDXiZDJI5ZC6VH3xhZ9NK/exec",
  logoBankOnline: "https://commons.wikimedia.org/wiki/Special:FilePath/Bank_Central_Asia.svg",
  jumlahKelopak: 14 // kelopak bunga yang jatuh per gelombang
};

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  setGuestName();
  createSparkles();
  setCalendarLink();
  startCountdown();
  initGallery();
  initLottie();
  initMusic();
  initCover();
  initGift();
  initWishes();
});

/* ---------- Amplop digital: logo BCA & tombol salin ---------- */
function initGift() {
  // Logo: pakai file lokal dulu; jika tidak ada, ambil logo resmi dari Wikimedia Commons;
  // jika tetap gagal, tampilkan tulisan "BCA".
  const logo = document.getElementById("bcaLogo");
  const sumberLogo = [CONFIG.logoBankOnline];
  const fallback = () => {
    const next = sumberLogo.shift();
    if (next) { logo.src = next; return; }
    logo.replaceWith(Object.assign(document.createElement("span"), { className: "logo-text", textContent: "BCA" }));
  };
  logo.addEventListener("error", fallback);
  if (logo.complete && logo.naturalWidth === 0) fallback();

  const btn = document.getElementById("btnCopy");
  const rek = document.getElementById("rekNumber").dataset.rek;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(rek);
    } catch {
      // Cadangan untuk browser lama / halaman non-HTTPS
      const t = document.createElement("textarea");
      t.value = rek; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    btn.querySelector("span").textContent = "Tersalin!";
    showToast("Nomor rekening BCA berhasil disalin");
    setTimeout(() => (btn.querySelector("span").textContent = "Salin No. Rekening"), 2000);
  });
}

function showToast(pesan) {
  const toast = document.getElementById("toast");
  toast.textContent = pesan;
  toast.classList.add("is-show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-show"), 2200);
}

/* ---------- Nama tamu dari URL: index.html?to=Nama+Tamu ---------- */
function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const nama = params.get("to") || params.get("kepada");
  if (nama) {
    document.getElementById("guestName").textContent = nama.replace(/\+/g, " ").trim();
  }
}

/* ---------- Titik emas berkelip di cover ---------- */
function createSparkles() {
  const wrap = document.querySelector(".sparkles");
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
    wrap.appendChild(s);
  }
}

/* ---------- Tombol "Simpan ke Kalender" (Google Calendar) ---------- */
function setCalendarLink() {
  const toGCal = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", CONFIG.judulKalender);
  url.searchParams.set("dates", `${toGCal(CONFIG.tanggalAcara)}/${toGCal(CONFIG.selesaiAcara)}`);
  url.searchParams.set("details", `Akad Nikah 10.00 WIB, Resepsi 11.00 WIB. Peta: ${CONFIG.linkMaps}`);
  url.searchParams.set("location", CONFIG.lokasi);
  document.getElementById("btnCalendar").href = url.toString();
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = new Date(CONFIG.tanggalAcara).getTime();
  const el = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMinutes"),
    s: document.getElementById("cdSeconds")
  };
  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.d.textContent = el.h.textContent = el.m.textContent = el.s.textContent = "00";
      document.getElementById("countdownDone").hidden = false;
      clearInterval(timer);
      return;
    }
    el.d.textContent = pad(Math.floor(diff / 86400000));
    el.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    el.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    el.s.textContent = pad(Math.floor((diff % 60000) / 1000));
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Galeri (Swiper) ---------- */
function initGallery() {
  new Swiper(".gallery__swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    rewind: true, // hanya 2 foto, jadi kembali ke awal (bukan loop)
    autoplay: { delay: 3500, disableOnInteraction: false },
    coverflowEffect: { rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: false },
    pagination: { el: ".swiper-pagination", clickable: true }
  });
}

/* ---------- Animasi Lottie (hati) ---------- */
function initLottie() {
  lottie.loadAnimation({
    container: document.getElementById("lottieHeart"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: window.LOTTIE_HEART
  });
}

/* ---------- Musik ---------- */
const music = { audio: null, btn: null };

function initMusic() {
  music.audio = document.getElementById("bgMusic");
  music.btn = document.getElementById("musicBtn");
  music.audio.volume = 0.8;

  music.btn.addEventListener("click", () => {
    music.audio.paused ? playMusic() : pauseMusic();
  });

  // Jeda saat tab ditinggal, lanjut lagi saat kembali (jika sebelumnya menyala)
  let wasPlaying = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      wasPlaying = !music.audio.paused;
      music.audio.pause();
    } else if (wasPlaying) {
      playMusic();
    }
  });
}

function playMusic() {
  music.audio.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
}
function pauseMusic() {
  music.audio.pause();
  setMusicState(false);
}
function setMusicState(isPlaying) {
  music.btn.classList.toggle("is-playing", isPlaying);
  music.btn.classList.toggle("is-paused", !isPlaying);
  music.btn.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
}

/* ---------- Cover: klik "Buka Undangan" ---------- */
function initCover() {
  const btn = document.getElementById("btnOpen");

  btn.addEventListener("click", () => {
    btn.disabled = true;

    // Klik = interaksi pengguna, jadi browser mengizinkan lagu diputar
    playMusic();
    music.btn.hidden = false;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    tl
      // 1. Isi cover mengecil & memudar, bunga melebar keluar
      .to(".cover__arch", { opacity: 0, scale: 0.92, y: -30, duration: 0.7 })
      .to(".cover__flower--top", { x: 120, y: -120, rotate: 20, opacity: 0, duration: 0.9 }, "<")
      .to(".cover__flower--bottom", { x: -120, y: 120, rotate: 160, opacity: 0, duration: 0.9 }, "<")
      // 2. Tirai tertutup dari kiri & kanan
      .set(".curtain", { visibility: "visible" })
      .fromTo(".curtain__half--left", { xPercent: -100 }, { xPercent: 0, duration: 0.6 }, "-=0.3")
      .fromTo(".curtain__half--right", { xPercent: 100 }, { xPercent: 0, duration: 0.6 }, "<")
      // 3. Cover disembunyikan, halaman dibuka
      .add(() => {
        document.getElementById("cover").style.display = "none";
        document.body.classList.remove("is-locked");
        window.scrollTo(0, 0);
      })
      // 4. Tirai terbuka ke samping
      .to(".curtain__half--left", { xPercent: -100, duration: 0.9 }, "+=0.15")
      .to(".curtain__half--right", { xPercent: 100, duration: 0.9 }, "<")
      .set(".curtain", { visibility: "hidden" })
      // 5. Hero muncul satu per satu
      .add(revealMain, "-=0.6");
  });
}

function revealMain() {
  gsap.from(".hero-anim", {
    opacity: 0, y: 40, scale: 0.95,
    duration: 1, stagger: 0.15, ease: "power2.out"
  });
  gsap.from(".hero .deco--tr", { x: 80, y: -80, opacity: 0, duration: 1.4, ease: "power2.out" });
  gsap.from(".hero .deco--bl", { x: -80, y: 80, opacity: 0, duration: 1.4, ease: "power2.out" });

  // AOS untuk animasi saat scroll
  AOS.init({ duration: 900, once: true, offset: 60, easing: "ease-out-cubic" });

  initParallax();
  startPetals();
}

/* ---------- Parallax ornamen bunga (GSAP ScrollTrigger) ---------- */
function initParallax() {
  gsap.utils.toArray(".deco").forEach((el) => {
    const isBottom = el.classList.contains("deco--bl");
    gsap.to(el, {
      y: isBottom ? -40 : 60,
      rotate: isBottom ? 190 : 10,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  gsap.to(".bigdate__num", {
    scale: 1.08, ease: "none",
    scrollTrigger: { trigger: ".event", start: "top bottom", end: "center center", scrub: true }
  });

  // Hati Lottie ikut berdetak lebih besar saat masuk layar
  gsap.from(".lottie-heart", {
    scale: 0, opacity: 0, duration: 1, ease: "back.out(1.7)",
    scrollTrigger: { trigger: ".closing", start: "top 75%" }
  });
}

/* ---------- Kelopak bunga berjatuhan ---------- */
function startPetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = document.getElementById("petals");

  const spawn = () => {
    const p = document.createElement("span");
    const size = 10 + Math.random() * 10;
    const dur = 7 + Math.random() * 6;
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.width = size + "px";
    p.style.height = size * 1.25 + "px";
    p.style.animationDuration = dur + "s";
    p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
    p.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
    wrap.appendChild(p);
    setTimeout(() => p.remove(), dur * 1000);
  };

  for (let i = 0; i < CONFIG.jumlahKelopak; i++) setTimeout(spawn, i * 350);
  setInterval(spawn, 900);
}

/* ==========================================================
   UCAPAN & RSVP
   Data disimpan ke Google Sheets lewat Google Apps Script
   (lihat backend/google-apps-script.gs dan README.md).
   ========================================================== */
const KEY_LOKAL = "rsvp_alda_yusro";

function initWishes() {
  const form = document.getElementById("wishForm");

  // Isi otomatis nama dari link ?to=
  const tamu = new URLSearchParams(location.search).get("to");
  if (tamu) document.getElementById("wishNama").value = tamu.replace(/\+/g, " ").trim();

  form.addEventListener("submit", submitWish);
  form.querySelectorAll("input, textarea").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("is-invalid"))
  );
  document.getElementById("thanksClose").addEventListener("click", closeThanks);
  document.getElementById("thanks").addEventListener("click", (e) => { if (e.target.id === "thanks") closeThanks(); });

  loadWishes();
}

/* ----- Ambil daftar ucapan ----- */
async function loadWishes() {
  let data = [];
  try {
    if (CONFIG.urlUcapan) {
      const res = await fetch(CONFIG.urlUcapan);
      const json = await res.json();
      data = json.data || [];
    } else {
      data = bacaLokal();
    }
  } catch (err) {
    console.error("Gagal memuat ucapan:", err);
    document.getElementById("wishList").innerHTML = '<p class="wish-list__empty">Ucapan belum dapat dimuat.</p>';
    return;
  }
  renderWishes(data);
}

function renderWishes(data) {
  const list = document.getElementById("wishList");
  list.innerHTML = "";
  if (!data.length) {
    list.innerHTML = '<p class="wish-list__empty">Belum ada ucapan. Jadilah yang pertama!</p>';
  } else {
    data.forEach((w) => list.appendChild(buatItemUcapan(w)));
  }
  updateStats(data);
}

function buatItemUcapan(w) {
  const item = document.createElement("article");
  item.className = "wish";
  const badgeClass = w.kehadiran === "Tidak Hadir" ? "wish__badge--tidak" : w.kehadiran === "Masih Ragu" ? "wish__badge--ragu" : "";
  item.innerHTML = `
    <div class="wish__head">
      <span class="wish__name"></span>
      <span class="wish__badge ${badgeClass}"></span>
    </div>
    <p class="wish__msg"></p>
    <small class="wish__time"></small>`;
  // textContent supaya isi dari pengunjung tidak bisa menyisipkan kode HTML
  item.querySelector(".wish__name").textContent = w.nama;
  item.querySelector(".wish__badge").textContent = w.kehadiran;
  item.querySelector(".wish__msg").textContent = w.ucapan;
  item.querySelector(".wish__time").textContent = waktuLalu(w.waktu);
  return item;
}

function updateStats(data) {
  const hitung = (k) => data.filter((w) => w.kehadiran === k).length;
  animasiAngka("statHadir", hitung("Hadir"));
  animasiAngka("statTidak", hitung("Tidak Hadir"));
  animasiAngka("statRagu", hitung("Masih Ragu"));
}

function animasiAngka(id, target) {
  const el = document.getElementById(id);
  const obj = { v: Number(el.textContent) || 0 };
  gsap.to(obj, { v: target, duration: 1, ease: "power1.out", onUpdate: () => (el.textContent = Math.round(obj.v)) });
}

function waktuLalu(iso) {
  const detik = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (detik < 60) return "Baru saja";
  const satuan = [["tahun", 31536000], ["bulan", 2592000], ["hari", 86400], ["jam", 3600], ["menit", 60]];
  for (const [nama, s] of satuan) {
    if (detik >= s) return `${Math.floor(detik / s)} ${nama} yang lalu`;
  }
  return "Baru saja";
}

/* ----- Kirim ucapan ----- */
async function submitWish(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("wishSubmit");
  const errorEl = document.getElementById("wishError");
  const nama = form.nama.value.trim();
  const ucapan = form.ucapan.value.trim();
  const kehadiran = form.kehadiran.value;

  errorEl.hidden = true;
  let valid = true;
  if (!nama) { form.nama.closest(".field").classList.add("is-invalid"); valid = false; }
  if (!ucapan) { form.ucapan.closest(".field").classList.add("is-invalid"); valid = false; }
  if (!valid) {
    errorEl.textContent = "Mohon isi nama dan ucapan terlebih dahulu.";
    errorEl.hidden = false;
    return;
  }

  btn.disabled = true;
  btn.classList.add("is-loading");
  btn.querySelector("span").textContent = "Mengirim...";

  const baru = { nama, ucapan, kehadiran, waktu: new Date().toISOString() };

  let berhasil = false;
  try {
    if (CONFIG.urlUcapan) {
      // Dikirim sebagai form biasa agar tidak diblokir CORS oleh Google Apps Script
      const res = await fetch(CONFIG.urlUcapan, { method: "POST", body: new URLSearchParams({ nama, ucapan, kehadiran }) });
      const json = await res.json();
      if (json.status !== "ok") throw new Error(json.message || "Gagal menyimpan");
    } else {
      simpanLokal(baru);
    }

    berhasil = true;
  } catch (err) {
    console.error(err);
    errorEl.textContent = "Maaf, ucapan gagal terkirim. Periksa koneksi lalu coba lagi.";
    errorEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    btn.querySelector("span").textContent = "Kirim Ucapan";
  }

  if (berhasil) {
    form.ucapan.value = "";
    tampilkanUcapanBaru(baru);
    showThanks(nama, kehadiran);
  }
}

function tampilkanUcapanBaru(w) {
  const list = document.getElementById("wishList");
  list.querySelector(".wish-list__empty")?.remove();
  const item = buatItemUcapan(w);
  item.classList.add("is-new");
  list.prepend(item);
  list.scrollTop = 0;
  gsap.from(item, { opacity: 0, y: -30, scale: 0.9, duration: 0.7, delay: 1.2, ease: "back.out(1.7)" });

  // Perbarui angka statistik
  const id = { "Hadir": "statHadir", "Tidak Hadir": "statTidak", "Masih Ragu": "statRagu" }[w.kehadiran];
  animasiAngka(id, Number(document.getElementById(id).textContent) + 1);
}

/* ----- Animasi terima kasih ----- */
function showThanks(nama, kehadiran) {
  const pesan = {
    "Hadir": "Kami menantikan kehadiran Anda di hari bahagia kami.",
    "Tidak Hadir": "Terima kasih atas doa dan ucapannya, semoga kita dapat berjumpa di lain waktu.",
    "Masih Ragu": "Semoga Anda berkesempatan hadir di hari bahagia kami."
  }[kehadiran];

  document.getElementById("thanksTitle").textContent = `Terima Kasih, ${nama.split(" ")[0]}`;
  document.getElementById("thanksMsg").textContent = pesan;

  const modal = document.getElementById("thanks");
  const box = modal.querySelector(".thanks__box");
  const circle = modal.querySelector(".thanks__check circle");
  const check = modal.querySelector(".thanks__check path");
  modal.hidden = false; // harus tampil dulu sebelum panjang garis SVG bisa diukur
  const lenC = 2 * Math.PI * 44;
  const lenP = check.getTotalLength();

  gsap.timeline()
    .fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    .fromTo(box, { scale: 0.6, y: 40, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.8)" }, "<")
    .fromTo(circle, { strokeDasharray: lenC, strokeDashoffset: lenC }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" })
    .fromTo(check, { strokeDasharray: lenP, strokeDashoffset: lenP }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" })
    .add(ledakanHati, "-=0.2")
    .from(".thanks__title, .thanks__msg, #thanksClose", { opacity: 0, y: 15, stagger: 0.12, duration: 0.4 }, "-=0.1");
}

function closeThanks() {
  const modal = document.getElementById("thanks");
  gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => (modal.hidden = true) });
  document.getElementById("ucapan").scrollIntoView({ behavior: "smooth", block: "end" });
}

// Hati & kelopak memancar dari tengah layar
function ledakanHati() {
  const wrap = document.getElementById("burst");
  const simbol = ["❤", "❀", "✿", "❤", "✦"];
  const warna = ["#8e2a45", "#c2566f", "#e2bd73", "#f6dcd8", "#7a1f35"];
  for (let i = 0; i < 36; i++) {
    const el = document.createElement("i");
    el.textContent = simbol[i % simbol.length];
    el.style.color = warna[i % warna.length];
    el.style.fontSize = 12 + Math.random() * 18 + "px";
    wrap.appendChild(el);
    const sudut = Math.random() * Math.PI * 2;
    const jarak = 120 + Math.random() * 200;
    gsap.fromTo(el,
      { x: 0, y: -60, scale: 0, rotate: 0, opacity: 1 },
      {
        x: Math.cos(sudut) * jarak,
        y: Math.sin(sudut) * jarak - 60 + 120,
        scale: 1, rotate: Math.random() * 360 - 180,
        opacity: 0, duration: 1.6 + Math.random() * 0.8, ease: "power2.out",
        onComplete: () => el.remove()
      });
  }
}

/* ----- Mode contoh (tanpa Google Sheets) ----- */
function bacaLokal() {
  try { return JSON.parse(localStorage.getItem(KEY_LOKAL)) || []; } catch { return []; }
}
function simpanLokal(w) {
  try { localStorage.setItem(KEY_LOKAL, JSON.stringify([w, ...bacaLokal()])); } catch { /* abaikan */ }
}
