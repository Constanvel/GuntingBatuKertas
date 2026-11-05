# GuntingBatuKertas

Game gunting, batu, kertas melawan AI menggunakan kamera dan model Teachable Machine.

Main langsung: https://constanvel.github.io/GuntingBatuKertas/

## Cara bermain

1. Buka tautan game di browser dengan koneksi internet.
2. Tekan START GAME dan izinkan akses kamera.
3. Tunggu sampai AI siap, lalu tunjukkan gestur batu, kertas, atau gunting ke kamera.
4. Saat prediksi sesuai dan confidence minimal 70%, tekan PLAY ROUND.
5. Ulangi untuk menambah skor. Muat ulang halaman untuk mengulang skor dari nol.

Gunakan pencahayaan yang cukup. Jika kamera gagal, periksa izin kamera di browser dan pastikan kamera tidak sedang dipakai aplikasi lain.

## Menjalankan di komputer

Dengan Python 3 terpasang, jalankan perintah berikut dari folder proyek:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Buka http://localhost:8000. Untuk akses dari perangkat lain, gunakan tautan HTTPS game di atas agar izin kamera tersedia.

## Berkas proyek

- index.html: halaman game.
- style.css: tampilan game.
- script.js: kamera, prediksi, ronde, dan skor.
- model/: model.json, metadata.json, dan weights.bin untuk pengenalan gestur.

TensorFlow.js dan Teachable Machine dimuat dari CDN sehingga koneksi internet diperlukan. Permainan berjalan di browser tanpa instalasi paket atau backend.
