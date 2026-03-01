import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    register(email, password)
      .then((data: any) => {
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/todos');
      })
      .catch(err => {
        if (err.response?.data?.errors) {
          setFieldErrors(err.response.data.errors);
        } else {
          setError('Registration failed. Please try again later.');
        }
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
      <h1 className="title is-2 has-text-weight-bold mb-5">Sign up</h1>

      {error && (
        <div className="notification is-danger is-light p-3 mb-4">
          <p className="has-text-danger is-size-6">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label className="label">Email</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`input ${fieldErrors.email ? 'is-danger' : ''}`}
              type="email"
              placeholder="e.g. bobsmith@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>
          {fieldErrors.email && (
            <p className="help is-danger">{fieldErrors.email}</p>
          )}
        </div>

        <div className="field mb-5">
          <label className="label">Password</label>
          <div className="control has-icons-left">
            <input
              className={`input ${fieldErrors.password ? 'is-danger' : ''}`}
              type="password"
              placeholder="*******"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          <p
            className={`help ${fieldErrors.password ? 'is-danger' : 'has-text-grey'}`}
          >
            {fieldErrors.password || 'At least 6 characters'}
          </p>
        </div>

        <div className="field mb-4">
          <div className="control">
            <button
              className={`button is-primary has-text-weight-bold is-fullwidth ${isLoading ? 'is-loading' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </div>
      </form>

      <div className="content mt-4 has-text-centered">
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};
