# Kalkulator Anuitas Pro

Aplikasi web modern untuk simulasi dan perhitungan **Anuitas Pinjaman / Kredit** secara interaktif dengan visualisasi grafik total pembayaran, pembagian porsi pokok dan bunga, serta tabel jadwal angsuran bulanan lengkap (amortisasi).

Dibangun dengan palet warna **Biru Red Bull & Ford Racing**, aksen **Silver metalik**, serta ornamen **Kuning dan Merah** yang memberikan kesan profesional, presisi, dan modern.

---

## Fitur Utama

- ⚡ **Input Pinjaman Interaktif**:
  - **Pokok Pinjaman**: Penggeser (*slider*) dinamis hingga miliaran Rupiah, input teks otomatis berformat Rupiah (`Rp`), dan tombol pintas cepat (25 Jt, 50 Jt, 100 Jt, 250 Jt, 500 Jt, 1 M, 2 M).
  - **Suku Bunga**: Pengaturan persentase tahunan (% p.a.), tombol stepper presisi (±0.25%), dan kalkulasi bunga bulanan real-time.
  - **Durasi / Tenor**: Pilihan durasi berbasis Tahun (1 s/d 30 Tahun) dengan pintas cepat.
  - **Preset Skenario**: KPR Rumah, Kredit Mobil Baru, Modal Usaha UMKM, dan Pinjaman Multiguna.
  - **Simulasi Pelunasan Dipercepat**: Input pembayaran pokok ekstra bulanan untuk menghitung penghematan bunga dan percepatan pelunasan.

- 📊 **Visualisasi Grafik Interaktif**:
  - **Donut Chart**: Komposisi Total Pembayaran (Porsi Pokok Pinjaman vs Total Beban Bunga).
  - **Grafik Amortisasi SVG**:
    - Mode Kurva Saldo Sisa Pokok (*Remaining Balance Curve*).
    - Mode Bar Porsi Angsuran Bulanan (Porsi Pokok yang membesar vs Porsi Bunga yang mengecil).
    - Dilengkapi *interactive hover/scrubbing* untuk melihat rincian bulan tertentu.

- 📋 **Tabel Angsuran Bulanan Lengkap**:
  - Kolom lengkap: Periode Bulan, Tahun, Saldo Awal, Angsuran Bulanan, Porsi Pokok, Porsi Bunga, Akumulasi Bunga, dan Sisa Pokok.
  - Pilihan tampilan: **Rincian Per Bulan** atau **Ringkasan Tahunan (*Yearly Rollup*)**.
  - Pencarian nomor bulan / tahun, sortir urutan, dan paginasi rapi.
  - **Ekspor CSV / Excel** langsung siap pakai (dengan delimiter semicolon standar IDR).
  - Dukungan **Cetak PDF / Print View**.

- ⚖️ **Komparasi Metode Bunga**:
  - Perbandingan langsung antara **Anuitas (Cicilan Tetap)**, **Bunga Efektif (Menurun)**, dan **Bunga Flat**.

---

## Teknologi yang Digunakan

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Plus Jakarta Sans & JetBrains Mono** (Tabular Numerals)

---

## Panduan Memasukkan ke GitHub

Ikuti langkah-langkah mudah berikut di terminal komputer Anda:

### 1. Buat Repository Baru di GitHub
1. Buka [github.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **New** (atau ikon `+` di kanan atas lalu pilih **New repository**).
3. Beri nama repository, misalnya: `kalkulator-anuitas-pro`.
4. Pilih **Public** atau **Private** sesuai keinginan Anda.
5. **Jangan centang** "Initialize this repository with a README" (karena file sudah tersedia).
6. Klik **Create repository**.

### 2. Inisialisasi & Push Kode dari Komputer Anda
Buka terminal/command prompt pada folder proyek ini, lalu jalankan perintah berikut:

```bash
# 1. Inisialisasi Git (jika belum diinisialisasi)
git init

# 2. Tambahkan semua file proyek
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi aplikasi kalkulator anuitas pro"

# 4. Ubah branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (ganti URL dengan URL repo Anda)
git remote add origin https://github.com/USERNAME_ANDA/kalkulator-anuitas-pro.git

# 6. Unggah kode ke GitHub
git push -u origin main
```

---

## Cara Menjalankan Proyek Secara Lokal

Jika Anda mengunduh atau meng-clone repository ini di komputer lain:

```bash
# 1. Clone repository
git clone https://github.com/USERNAME_ANDA/kalkulator-anuitas-pro.git

# 2. Masuk ke folder proyek
cd kalkulator-anuitas-pro

# 3. Pasang seluruh dependensi
npm install

# 4. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban (*browser*) Anda di `http://localhost:3000`.

### Build untuk Produksi
```bash
npm run build
```
File hasil kompilasi akan berada di folder `dist/` dan siap dideploy langsung ke Vercel, Netlify, atau Cloud Run.

---

## Panduan Deploy ke Vercel

Aplikasi ini sudah dilengkapi file konfigurasi `vercel.json` dan siap dideploy dengan 2 cara:

### Cara 1: Deploy Otomatis via GitHub (Sangat Disarankan)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari dan pilih repository `kalkulator-anuitas-pro` dari daftar GitHub Anda, lalu klik **"Import"**.
4. Di bagian konfigurasi:
   - **Framework Preset**: Terdeteksi otomatis sebagai **Vite**.
   - **Root Directory**: `./` (biarkan default).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
5. Klik **"Deploy"**.
6. Dalam waktu kurang dari 1 menit, website Anda sudah online dan mendapatkan domain gratis (misal: `https://kalkulator-anuitas-pro.vercel.app`).

### Cara 2: Deploy Cepat via Vercel CLI (Terminal)
Jika Anda menggunakan terminal komputer:
```bash
# 1. Pasang Vercel CLI (jika belum ada)
npm i -g vercel

# 2. Jalankan perintah deploy
vercel

# 3. Untuk deploy ke domain produksi final
vercel --prod
```

---

## Lisensi
Proyek ini dilisensikan di bawah Apache-2.0.
