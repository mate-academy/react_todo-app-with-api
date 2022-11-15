import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { createUser, getUserByEmail } from '../../api/users';
import { ErrorNoticeType } from '../../types/ErrorNoticeType';
import { User } from '../../types/User';

export type Props = {
  onLogin: (user: User) => void,
};

export const AuthForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [needToRegister, setNeedToRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice]
    = useState<ErrorNoticeType>(ErrorNoticeType.None);

  const saveUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    onLogin(user);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      return;
    }

    try {
      const user = JSON.parse(userData) as User;

      onLogin(user);
    } catch {
      setErrorNotice(ErrorNoticeType.LoginError);
    }
  }, []);

  const loadUser = async () => {
    const user = await getUserByEmail(email);

    if (user) {
      saveUser(user);
    } else {
      setNeedToRegister(true);
    }
  };

  const registerUser = async () => {
    const newUser = await createUser({ name, email });

    await saveUser(newUser);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorNotice(ErrorNoticeType.None);
    setIsLoading(true);

    try {
      if (needToRegister) {
        await registerUser();
      } else {
        await loadUser();
      }
    } catch (error) {
      setErrorNotice(ErrorNoticeType.SignupError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box mt-5">
      <h1 className="title is-3">
        {needToRegister ? 'You need to register' : 'Log in to open todos'}
      </h1>

      <div className="field">
        <label className="label" htmlFor="user-email">
          Email
        </label>

        <div
          className={classNames('control has-icons-left', {
            'is-loading': isLoading,
          })}
        >
          <input
            type="email"
            id="user-email"
            className={classNames('input', {
              'is-danger': !needToRegister && errorNotice,
            })}
            placeholder="Enter your email"
            disabled={isLoading || needToRegister}
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>

        {!needToRegister && errorNotice && (
          <p className="help is-danger">{errorNotice}</p>
        )}
      </div>

      {needToRegister && (
        <div className="field">
          <label className="label" htmlFor="user-name">
            Your Name
          </label>

          <div
            className={classNames('control has-icons-left', {
              'is-loading': isLoading,
            })}
          >
            <input
              type="text"
              id="user-name"
              className={classNames('input', {
                'is-danger': needToRegister && errorNotice,
              })}
              placeholder="Enter your name"
              required
              minLength={4}
              disabled={isLoading}
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <span className="icon is-small is-left">
              <i className="fas fa-user" />
            </span>
          </div>

          {needToRegister && errorNotice && (
            <p className="help is-danger">{errorNotice}</p>
          )}
        </div>
      )}

      <div className="field">
        <button
          type="submit"
          className={classNames('button is-primary', {
            'is-loading': isLoading,
          })}
        >
          {needToRegister ? 'Register' : 'Login'}
        </button>
      </div>
    </form>
  );
};
