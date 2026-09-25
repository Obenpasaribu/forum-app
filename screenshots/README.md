# Screenshot Evidence — Wajib Diisi Sebelum Submit

Folder ini **harus** berisi 3 gambar berikut sebelum ZIP dikirim ke Dicoding.
Screenshot ini tidak bisa dibuat otomatis — harus diambil langsung dari akun
GitHub & Vercel Anda sendiri setelah repository di-push dan CI/CD berjalan.

| Nama file                 | Cara mendapatkan |
|----------------------------|-------------------|
| `1_ci_check_error.png`     | 1. Buat branch baru, ubah salah satu file test agar sengaja gagal (mis. `expect(1).toBe(2)`).<br>2. Push branch tsb & buka Pull Request ke `main`.<br>3. Tunggu GitHub Actions selesai jalan → akan muncul status ❌ merah pada tab "Checks" di halaman PR.<br>4. Screenshot tampilan tersebut. |
| `2_ci_check_pass.png`      | 1. Kembalikan/hapus perubahan yang sengaja gagal tadi, commit ulang.<br>2. GitHub Actions akan jalan lagi dan menunjukkan status ✅ hijau.<br>3. Screenshot tampilan tersebut. |
| `3_branch_protection.png`  | 1. Buka repository di GitHub → **Settings → Branches**.<br>2. Screenshot rule yang sudah dikonfigurasi (require PR, require status checks) — atau screenshot halaman PR yang menunjukkan tombol merge terkunci sampai check lulus. |

## Checklist sebelum submit

- [ ] `1_ci_check_error.png` ada di folder ini
- [ ] `2_ci_check_pass.png` ada di folder ini
- [ ] `3_branch_protection.png` ada di folder ini
- [ ] URL Vercel aplikasi sudah dicatat di catatan submission
- [ ] Hapus file `README.md` ini sendiri jika tidak ingin ikut ter-review (opsional, tidak wajib)
