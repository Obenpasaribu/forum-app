import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="app-main">
      <h1>Halaman tidak ditemukan</h1>
      <p>Halaman yang Anda cari tidak tersedia.</p>
      <Link className="btn" to="/">
        Kembali ke beranda
      </Link>
    </div>
  );
}

export default NotFoundPage;
