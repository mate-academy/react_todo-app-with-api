import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const MainHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav
      className="navbar is-white"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link
              to="/"
              className={`navbar-item ${isActive('/') ? 'has-text-primary has-text-weight-bold' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/todos"
              className={`navbar-item ${isActive('/todos') ? 'has-text-primary has-text-weight-bold' : ''}`}
            >
              Todos
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="button is-light">
                    Log out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/registration"
                      className={`button ${isActive('/registration') ? 'is-primary' : 'is-light'}`}
                    >
                      <strong>Sign up</strong>
                    </Link>
                    <Link
                      to="/login"
                      className={`button ${isActive('/login') ? 'is-primary' : 'is-light'}`}
                    >
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
