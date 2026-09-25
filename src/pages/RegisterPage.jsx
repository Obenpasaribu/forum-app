import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncRegisterUser } from '../states/authUser/action';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSubmitting = useSelector((state) => state.loading.submit);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (form.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    const success = await dispatch(asyncRegisterUser(form));
    if (success) navigate('/login');
  };

  return (
    <div className="app-main">
      <div className="form-card">
        <h2>Buat akun baru</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nama</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses…' : 'Daftar'}
          </button>
        </form>
        <p className="form-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
