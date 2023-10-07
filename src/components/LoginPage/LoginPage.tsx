import classNames from 'classnames';
import { useState } from 'react';
import { useTodos } from '../../TodoContext';
import { Error } from '../Error/Error';
import * as todoService from '../../api/todos';
import { User } from '../../types/User';

export const LoginPage = () => {
  const {
    isLoading,
    setUserId,
    setErrorMessage,
    setIsLoading,
  } = useTodos();
  const [userEmail, setUserEmail] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const name = 'user';
  const username = 'username';
  const phone = '0123456789';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value);
  };

  const getUserId = () => {
    const isUserExist = allUsers.find(user => user.email === userEmail);

    if (isUserExist) {
      return isUserExist.id;
    }

    return 0;
  };

  function createUser() {
    todoService.createUser({
      name, username, email: userEmail, phone,
    })
      .then((user) => {
        const newUsers = [...allUsers, user];

        setAllUsers(newUsers);
        setUserId(user.id);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }

  function getAllUsers() {
    todoService.getAllUsers()
      .then((existingUsers) => {
        setAllUsers(existingUsers);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }

  const handleSubmit = () => {
    setIsLoading(true);
    getAllUsers();
    const newId = getUserId();

    if (!newId) {
      createUser();
    }

    setUserId(getUserId());
  };

  return (
    <>
      <form className="box mt-5">
        <h1 className="title is-3">Log in to open todos</h1>
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
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>
        </div>
        <div className="field">
          <button
            onSubmit={handleSubmit}
            type="submit"
            className={classNames('button is-primary', {
              'is-loading': isLoading,
            })}
          >
            Login
          </button>
        </div>
      </form>

      <Error />
    </>
  );
};
