import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email is required');

      return;
    }

    if (!password) {
      setError('Password is required');

      return;
    }

    setIsLoading(true);

    login(email, password)
      .then(response => {
        localStorage.setItem('accessToken', response.accessToken);

        navigate('/');
      })
      .catch(() => {
        setError('Invalid email or password');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className="box"
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%',
        padding: '2.5rem',
      }}
    >
      <h1 className="title is-2 has-text-weight-bold mb-5">Log in</h1>

      {error === 'Invalid email or password' && (
        <div className="notification is-danger is-light p-3 mb-4">
          <p className="has-text-danger is-size-6">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label className="label">Email</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${error === 'Email is required' ? 'is-danger' : ''}`}
              type="email"
              placeholder="e.g. bobsmith@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
            {error === 'Email is required' && (
              <span className="icon is-small is-right">
                <i className="fas fa-exclamation-triangle has-text-danger"></i>
              </span>
            )}
          </div>
          {error === 'Email is required' && (
            <p className="help is-danger">Email is required</p>
          )}
        </div>

        <div className="field mb-5">
          <label className="label">Password</label>
          <div className="control has-icons-left">
            <input
              className={`input ${error === 'Password is required' ? 'is-danger' : ''}`}
              type="password"
              placeholder="*******"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          {error === 'Password is required' && (
            <p className="help is-danger">Password is required</p>
          )}
        </div>

        <div className="field mb-4">
          <div className="control">
            <button
              className={`button is-primary has-text-weight-bold is-fullwidth ${isLoading ? 'is-loading' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              Log in
            </button>
          </div>
        </div>
      </form>

      <div className="content mt-4 has-text-centered">
        <p>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
