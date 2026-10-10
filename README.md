# Jelajah Tata Surya AR

Proyek UTS Nicole: aplikasi edukasi marker-based AR menggunakan HTML, CSS, JavaScript, A-Frame 1.6.0 dan AR.js 3.4.7. Kamera dan marker Hiro diperlukan untuk melihat objek; aplikasi tidak menggantikan kamera dengan simulasi biasa.

## Fitur

- Matahari dan delapan planet 3D di atas marker Hiro.
- Rotasi planet, revolusi mengelilingi Matahari, dan cincin Saturnus.
- Tekstur lokal untuk Bumi, Merkurius, Venus, Mars, Saturnus, Uranus dan Neptunus pada mode tata surya dan planet besar. Jupiter tetap berwarna polos karena unduhan gagal.
- Dropdown planet, informasi edukasi, jeda/lanjutkan dan kecepatan 0,5–4 kali.
- Status marker, pesan kamera, petunjuk, dan panel yang dapat diringkas.

## Struktur proyek

```text
index.html                 Halaman AR, library, aset dan kontrol
style.css                  Tampilan responsif
script.js                  Objek 3D, animasi dan interaksi
assets/textures/bumi.jpg    Tekstur Bumi JPEG 2048 × 1024
assets/textures/*.jpg       Enam tekstur planet tambahan JPEG 2048 × 1024
README.md                  Panduan proyek
tests/logic.cjs             Pemeriksaan logika tanpa browser
tests/assets.cjs            Pemeriksaan pemuatan aset melalui HTTP lokal
```

## Menjalankan lokal

1. Buka terminal di folder proyek.
2. Jika Python tersedia, jalankan `python -m http.server 8000` (atau `py -m http.server 8000`). Alternatif: gunakan ekstensi Live Server pada VS Code.
3. Buka `http://localhost:8000/` di browser laptop dan izinkan kamera. Jangan membuka lewat `file://`.
4. Koneksi internet diperlukan untuk library CDN.

Kamera memerlukan HTTPS atau localhost. Membuka alamat HTTP IP laptop dari HP biasanya tidak mengizinkan kamera; gunakan hosting HTTPS untuk uji HP. Periksa izin kamera pada browser dan pastikan kamera tidak sedang dipakai aplikasi lain.

## Menggunakan marker

1. Buka [marker Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/3.4.7/data/images/hiro.png), lalu cetak atau tampilkan pada perangkat lain.
2. Gunakan marker lengkap termasuk batas hitam dan ruang putih di sekelilingnya. Hindari pantulan cahaya.
3. Arahkan kamera hingga seluruh marker terlihat. Status berubah menjadi “Marker ditemukan”.
4. Pilih Bumi atau planet lain untuk melihat versi besar dan informasi. Pilih “Tampilkan Tata Surya” untuk kembali.
5. Gunakan Jeda/Lanjutkan dan Kecepatan. Ringkas panel dengan menekan judulnya jika menghalangi kamera.

## Sumber aset dan referensi

- [A-Frame 1.6.0](https://aframe.io/releases/1.6.0/aframe.min.js).
- [AR.js 3.4.7](https://github.com/AR-js-org/AR.js/tree/3.4.7), termasuk marker Hiro.
- `bumi.jpg`: aset yang sudah disediakan dalam proyek. Pemeriksaan memastikan JPEG valid berisi peta datar equirectangular 2:1, bukan foto globe atau HTML. Sumber asli/pembuat dan lisensinya belum tercatat; perlu dilengkapi pemilik proyek dari tempat mengunduh gambar tersebut. Jangan menganggap asalnya NASA tanpa bukti.
- Matahari, penanda rotasi dan cincin dibuat dari geometri A-Frame. Cincin Saturnus tetap menggunakan implementasi sebelumnya.
- [NASA Solar System](https://science.nasa.gov/solar-system/) sebagai referensi belajar lebih lanjut.

### Tekstur tambahan 

Atribusi: **Planet textures by Solar System Scope / INOVE**, dari [Solar System Scope Textures](https://www.solarsystemscope.com/textures/), berlisensi [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Izin mencakup penggunaan, pembagian dan adaptasi, termasuk komersial, dengan atribusi, tautan lisensi dan penjelasan perubahan. Pertahankan atribusi ini saat membagikan proyek.

Semua unduhan berhasil berikut adalah peta equirectangular JPEG 2048 × 1024. File hanya diganti namanya, tanpa perubahan gambar. Venus memakai peta atmosfer, bukan permukaan. Warna material planet bertekstur putih agar tidak memberi warna tambahan; pencahayaan 3D tetap memengaruhi kecerahan. Peta sumber merupakan olahan data/citra dengan penyesuaian warna dan sebagian pengisian area yang belum dipetakan; bukan pengukuran ilmiah lengkap.

| File lokal | Unduhan asli | Lisensi |
| --- | --- | --- |
| `merkurius.jpg` | [2k_mercury.jpg](https://www.solarsystemscope.com/textures/download/2k_mercury.jpg) | CC BY 4.0 |
| `venus.jpg` | [2k_venus_atmosphere.jpg](https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg) | CC BY 4.0 |
| `mars.jpg` | [2k_mars.jpg](https://www.solarsystemscope.com/textures/download/2k_mars.jpg) | CC BY 4.0 |
| `saturnus.jpg` | [2k_saturn.jpg](https://www.solarsystemscope.com/textures/download/2k_saturn.jpg) | CC BY 4.0 |
| `uranus.jpg` | [2k_uranus.jpg](https://www.solarsystemscope.com/textures/download/2k_uranus.jpg) | CC BY 4.0 |
| `neptunus.jpg` | [2k_neptune.jpg](https://www.solarsystemscope.com/textures/download/2k_neptune.jpg) | CC BY 4.0 |

**Jupiter:** unduhan `2k_jupiter.jpg` pada domain `www.solarsystemscope.com` dan alternatif resmi `edu.solarsystemscope.com` sama-sama gagal HTTP 403. Tidak ada aset Jupiter yang dipasang; warna polos `#c99b70` dan penanda rotasinya dipertahankan pada kedua mode. Bumi yang sebelumnya sudah berhasil tidak diganti dan lisensinya tidak disamakan dengan aset baru.

## Batasan simulasi

Ukuran, jarak, serta waktu orbit **bukan skala astronomi nyata**. Orbit berbentuk lingkaran pada satu bidang. Rotasi disamakan untuk memperlihatkan gerakan; arah, kemiringan sumbu dan periode asli tiap planet belum dimodelkan. Penanda putih pada planet tanpa tekstur adalah alat bantu rotasi, bukan satelit. Pencahayaan dibuat agar objek mudah dilihat, bukan simulasi fisika. Planet detail berotasi di tengah marker tanpa orbit. Animasi dijeda oleh tombol; saat marker hilang objek otomatis disembunyikan oleh AR.js, sementara waktu animasi dapat tetap berjalan.

## Validasi dan pengujian manual

Jalankan `node --check script.js` untuk sintaks dan `node tests/logic.cjs` untuk pemeriksaan logika menggunakan tiruan DOM/A-Frame. Pemeriksaan logika bukan bukti hasil render atau pelacakan kamera.

Pembaruan tekstur: enam gambar baru berhasil didekode dan diperiksa visual sebagai peta datar 2:1. `node tests/assets.cjs` memeriksa respons HTTP lokal dan kesamaan byte semua aset lokal pada subpath `/Augmented_Reality_UTSnicole/`. Pengujian logika mencakup 180 pergantian pilihan serta material, skala, cincin, jeda dan kecepatan seluruh planet pada mode tata surya/detail. Browser tetap tidak tersedia pada sesi pembaruan; tampilan GPU dan kamera belum diuji oleh agen.

Pada sesi perbaikan, gambar dibuka secara visual dan diperiksa format/dimensinya. URL library diperiksa melalui HTTP. Browser pengujian tidak tersedia, sehingga console browser, WebGL, pemuatan tekstur pada GPU, izin kamera dan marker fisik **belum diuji**.

Checklist uji di browser laptop dan HP:

- Buka DevTools Console dan Network, muat ulang; pastikan tidak ada error dan `style.css`, `script.js`, `bumi.jpg` serta kedua library berhasil dimuat.
- Izinkan kamera; tutup/tampilkan marker beberapa kali dan amati status serta objek.
- Amati Bumi di tata surya, pilih Bumi besar: benua dan lautan harus terlihat dengan warna alami, tanpa lapisan biru tambahan.
- Ulangi pemeriksaan visual pada Merkurius, Venus, Mars, Saturnus, Uranus dan Neptunus di kedua mode. Pastikan setiap planet memakai peta yang sesuai, cincin Saturnus tetap tampil, dan Jupiter tetap polos. Di Network, ketujuh JPEG lokal (termasuk Bumi) harus berhasil dimuat.
- Ulangi Bumi → Saturnus → Mars → Bumi → Tata Surya sedikitnya 20 kali. Harus hanya ada satu planet detail dan satu cincin pada Saturnus, tanpa objek tersisa atau error console.
- Tekan Jeda pada kedua mode: semua gerakan berhenti. Ganti planet dan kecepatan saat dijeda: tetap berhenti sampai Lanjutkan ditekan.
- Bandingkan 0,5×, 1×, 2×, 4× di kedua mode; laju rotasi dan revolusi berubah. Di mode detail hanya rotasi yang terlihat.
- Coba layar HP tegak/mendatar, ringkas panel, dan pastikan kontrol dapat disentuh serta kamera tetap terlihat.
- Uji juga URL GitHub Pages setelah deploy untuk memastikan aset tetap bekerja pada subpath.


Author by Nicole :b