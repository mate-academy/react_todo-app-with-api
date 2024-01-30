import classNames from 'classnames';
import { useState } from 'react';
import { useTodos } from '../../TodoContext';
import { Error } from '../Error/Error';
import * as todoService from '../../api/todos';

export const LoginPage = () => {
  const {
    isLoading,
    setUser,
    setErrorMessage,
    setIsLoading,
  } = useTodos();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userNotRegistred, setUserNotRegistred] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value);
  };

  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (userNotRegistred) {
      return todoService.createUser({
        name: userName,
        username: '',
        email: userEmail,
        phone: '',
      })
        .then((response) => {
          setUser(response);
          setUserNotRegistred(false);
        })
        .catch(() => setErrorMessage('Unable to load todos'))
        .finally(() => setIsLoading(false));
    }

    return todoService.getUser(userEmail)
      .then((response) => {
        if (response[0]) {
          setUser(response[0]);
        } else {
          setUserNotRegistred(true);
        }
      })
      .catch(() => {
        setErrorMessage('Unable to load todo');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="box mt-5"
        onSubmit={handleSubmit}
      >
        <h1 className="title is-3">
          {userNotRegistred ? 'You need to register' : 'Log in to open todos'}
        </h1>
        <div className="field">
          <label className="label" htmlFor="user-email">Email</label>
          <div className="control has-icons-left">
            <input
              onChange={handleChange}
              className="input"
              type="email"
              id="user-email"
              value={userEmail}
              placeholder="Enter your email"
              required
              disabled={userNotRegistred || isLoading}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>
        </div>
        {!userNotRegistred ? (
          <div className="field">
            <button
              type="submit"
              className={classNames('button is-primary', {
                'is-loading': isLoading,
              })}
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <div className="field">
              <label className="label" htmlFor="user-name">Your Name</label>
              <div className="control has-icons-left">
                <input
                  type="text"
                  id="user-id"
                  className="input"
                  placeholder="Enter your name"
                  required
                  minLength={4}
                  value={userName}
                  onChange={handleUserName}
                  disabled={isLoading}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user" />
                </span>
              </div>
            </div>
            <div className="field">
              <button
                type="submit"
                className={classNames('button is-primary', {
                  'is-loading': isLoading,
                })}
              >
                Register
              </button>
            </div>
          </>
        )}
      </form>

      <Error />
    </>
  );
};
