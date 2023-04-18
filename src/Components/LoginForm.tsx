import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppContext';
import { findUser, addUsers } from '../api/todos';
import { Notification } from './Notification';
import { StringValues } from '../types/enums';

const prevUsersFromLocalStorage: string[] | 0 = JSON
  .parse(localStorage.getItem(StringValues.prevusers) || '0');

const addPrevUser = (prevEmail: string) => {
  if (prevUsersFromLocalStorage) {
    if (prevUsersFromLocalStorage.length === 5) {
      prevUsersFromLocalStorage.pop();
    }

    if (prevUsersFromLocalStorage
      .filter(mail => mail === prevEmail).length === 0) {
      prevUsersFromLocalStorage.unshift(prevEmail);
    }

    localStorage
      .setItem(
        StringValues.prevusers,
        JSON.stringify(prevUsersFromLocalStorage),
      );
  } else {
    localStorage.setItem(StringValues.prevusers, JSON.stringify([prevEmail]));
  }
};

export const LoginForm: React.FC = () => {
  const { setUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrevUsers, setShowPrevUsers] = useState(false);
  const hasErrorFromServer = !!errorMessage;
  const [tempEmail, setTempEmail] = useState('');

  const ref = useRef<HTMLInputElement>(null);

  const toshowPrevUsers = useMemo(() => (prevUsersFromLocalStorage !== 0
    ? prevUsersFromLocalStorage
      .filter(preMail => !email.length || preMail.includes(email))
    : 0),
  [email]);

  const clearNotification = () => {
    setErrorMessage('');
  };

  const newUserObject = {
    name,
    username: '',
    email,
    phone: '',
    website: '',
  };

  const addUser = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const exitingUserLogin = async (emailForLogin: string) => {
      try {
        const userExits = await findUser(emailForLogin);

        if (userExits.length !== 0) {
          localStorage.setItem(
            StringValues.user,
            JSON.stringify(userExits[0]),
          );
          setUser(userExits[0]);
          addPrevUser(emailForLogin);
        } else {
          setNewUser(true);
          setEmailDisabled(true);
          setIsLoading(false);
        }
      } catch {
        setErrorMessage('Unable to login');
        setIsLoading(false);
      }
    };

    if (email && !newUser) {
      exitingUserLogin(email);
    }

    if (name && newUser) {
      try {
        const addedUser = await addUsers(newUserObject);

        if (addedUser) {
          exitingUserLogin(email);
        }
      } catch {
        setErrorMessage('Unable to login');
        setIsLoading(false);
      }
    }
  };

  const selectPrevUsers = (prevmail: string) => {
    setTimeout(() => {
      setEmail(prevmail);
      setTempEmail(prevmail);
      ref.current?.focus();
      setShowPrevUsers(false);
    }, 0);
  };

  const onChangeLoginInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (tempEmail !== e.target.value) {
      setShowPrevUsers(true);
    }
  };

  const onBack = () => {
    setNewUser(false);
    setEmailDisabled(false);
    setName('');
  };

  return (
    <>
      <form
        className="box is-size-3 mt-5"
        onSubmit={addUser}
      >
        <h1 className="title is-3">Log in to open todos</h1>
        <div className="field prevuser-p">
          <label className="label" htmlFor="user-email">Email</label>
          <div className="control has-icons-left">
            <input
              type="email"
              id="user-email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={onChangeLoginInput}
              required
              disabled={emailDisabled}
              onFocus={() => setShowPrevUsers(true)}
              onBlur={() => setShowPrevUsers(false)}
              ref={ref}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>

          {toshowPrevUsers && !!toshowPrevUsers.length && showPrevUsers && (
            <div className="prevuser">
              {toshowPrevUsers.map((prevmail) => (
                <button
                  key={prevmail}
                  type="button"
                  className="todo__title prevuser__button"
                  onMouseDown={() => selectPrevUsers(prevmail)}
                >
                  {prevmail}
                </button>
              ))}
              <p className="lastlogin">
                last 5 logins
              </p>
            </div>
          )}
        </div>

        {newUser && (
          <div className="field">
            <label className="label" htmlFor="user-name">Name</label>
            <div className="control has-icons-left">
              <input
                type="text"
                id="user-name"
                className="input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </div>
          </div>
        )}

        <div className="field">
          <button
            type="submit"
            className={classNames(
              'button is-primary',
              { 'is-loading': isLoading },
            )}
          >
            Login
          </button>
          {newUser && (
            <button
              type="button"
              className="button mx-5 is-primary"
              onClick={onBack}
            >
              Back
            </button>
          )}
        </div>
      </form>
      <Notification
        hasErrorFromServer={hasErrorFromServer}
        clearNotification={clearNotification}
        errorMessage={errorMessage}
      />
    </>
  );
};
