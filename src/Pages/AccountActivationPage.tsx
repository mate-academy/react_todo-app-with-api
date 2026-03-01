import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activate } from '../api/auth';

export const AccountActivationPage: React.FC = () => {
  const { activationToken } = useParams<{ activationToken: string }>();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  useEffect(() => {
    if (!activationToken) {
      setStatus('error');

      return;
    }

    activate(activationToken)
      .then(() => {
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [activationToken]);

  return (
    <div className="is-flex is-justify-content-center mt-6">
      <div
        className="box has-text-centered"
        style={{ padding: '3rem 2rem', width: '100%', maxWidth: '450px' }}
      >
        <h1 className="title is-3 has-text-weight-bold mb-5">
          Account Activation
        </h1>

        {status === 'loading' && (
          <div>
            <span className="icon is-large has-text-primary mb-3">
              <i className="fas fa-spinner fa-pulse fa-3x"></i>
            </span>
            <p className="is-size-5">Activating your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <span className="icon is-large has-text-success mb-3">
              <i className="fas fa-check-circle fa-3x"></i>
            </span>
            <p className="is-size-5 mb-4">
              Your account has been successfully activated!
            </p>
            <Link
              to="/login"
              className="button is-primary has-text-weight-bold"
            >
              Go to Log in
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <span className="icon is-large has-text-danger mb-3">
              <i className="fas fa-exclamation-circle fa-3x"></i>
            </span>
            <p className="is-size-5 mb-4">
              Activation link is invalid or has expired.
            </p>
            <Link
              to="/registration"
              className="button is-light has-text-weight-bold"
            >
              Back to Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
