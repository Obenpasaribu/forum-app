import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import { asyncUnsetAuthUser } from '../states/authUser/action';

function Navbar() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/">
          <span className="brand-mark">&#9673;</span>
          Forum Diskusi
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>
            Threads
          </NavLink>
          <NavLink to="/leaderboards">Leaderboard</NavLink>
          {authUser && <NavLink to="/threads/new">Buat Thread</NavLink>}
        </nav>
        {authUser ? (
          <div className="nav-user">
            <Avatar src={authUser.avatar} name={authUser.name} size={26} />
            <span>{authUser.name}</span>
            <button type="button" className="btn-text" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        ) : (
          <div className="nav-user">
            <NavLink to="/login" className="btn-text">
              Masuk
            </NavLink>
            <NavLink to="/register" className="btn btn-outline">
              Daftar
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
