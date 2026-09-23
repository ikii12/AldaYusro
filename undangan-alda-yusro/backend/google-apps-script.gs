/**
 * Backend RSVP & Ucapan - Undangan Alda & Yusro
 * Tempel kode ini di Google Sheets > Extensions > Apps Script,
 * lalu Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */
const NAMA_SHEET = "Ucapan";
const PILIHAN = ["Hadir", "Tidak Hadir", "Masih Ragu"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NAMA_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(NAMA_SHEET);
    sheet.appendRow(["Waktu", "Nama", "Kehadiran", "Ucapan"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// GET: mengembalikan semua ucapan (terbaru di atas)
function doGet() {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  const rows = last > 1 ? sheet.getRange(2, 1, last - 1, 4).getValues() : [];
  const data = rows.reverse().map(function (r) {
    return { waktu: new Date(r[0]).toISOString(), nama: String(r[1]), kehadiran: String(r[2]), ucapan: String(r[3]) };
  });
  return json_({ status: "ok", data: data });
}

// POST: menyimpan satu ucapan baru
function doPost(e) {
  const p = (e && e.parameter) || {};
  const nama = bersihkan_(p.nama, 60);
  const ucapan = bersihkan_(p.ucapan, 500);
  const kehadiran = PILIHAN.indexOf(p.kehadiran) > -1 ? p.kehadiran : "Masih Ragu";

  if (!nama || !ucapan) return json_({ status: "error", message: "Nama dan ucapan wajib diisi" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([new Date(), nama, kehadiran, ucapan]);
  } finally {
    lock.releaseLock();
  }
  return json_({ status: "ok" });
}

function bersihkan_(v, max) {
  v = String(v || "").trim().slice(0, max);
  // Cegah isian dianggap rumus oleh Google Sheets
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
