import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { asyncAddThread } from '../states/threads/action';

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);
  const isSubmitting = useSelector((state) => state.loading.submit);
  const [form, setForm] = useState({ title: '', body: '', category: '' });
  const [error, setError] = useState('');

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title || !form.body) {
      setError('Judul dan isi thread wajib diisi.');
      return;
    }

    const threadId = await dispatch(asyncAddThread(form));
    if (threadId) navigate(`/threads/${threadId}`);
  };

  return (
    <div className="app-main">
      <div className="form-card form-card--wide">
        <h2>Buat thread baru</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Judul</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="category">Kategori (opsional)</label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="mis. General, Tanya Jawab, Showcase"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="body">Isi thread</label>
            <textarea id="body" name="body" value={form.body} onChange={handleChange} />
          </div>
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim…' : 'Publikasikan Thread'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;
