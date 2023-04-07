import React, {
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

const addPrevUser = (prevEmail: string) => {
  const getPrevUsers: string[] | 0 = JSON
    .parse(localStorage.getItem('prevusers') || '0');

  if (getPrevUsers !== 0) {
    if (getPrevUsers.length === 5) {
      getPrevUsers.pop();
    }

    if (getPrevUsers.filter(mail => mail === prevEmail).length === 0) {
      getPrevUsers.unshift(prevEmail);
    }

    localStorage.setItem('prevusers', JSON.stringify(getPrevUsers));
  } else {
    localStorage.setItem('prevusers', JSON.stringify([prevEmail]));
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

  const ref = useRef(null);

  let tempEmail = '';

  const prevUsers: string[] | 0 = JSON
    .parse(localStorage.getItem('prevusers') || '0');

  const toshowPrevUsers = useMemo(() => {
    return prevUsers !== 0 ? prevUsers
      .filter(preMail => {
        return email !== '' ? preMail.includes(email) : true;
      }) : 0;
  }, [email]);

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
            'user',
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

  return (
    <>
      <form
        className="box is-size-3 mt-5"
        onSubmit={(e) => addUser(e)}
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (tempEmail !== e.target.value) {
                  setShowPrevUsers(true);
                }
              }}
              required
              disabled={emailDisabled}
              onFocus={() => setShowPrevUsers(true)}
              ref={ref}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>

          {toshowPrevUsers !== 0 && toshowPrevUsers.length !== 0
          && showPrevUsers && (
            <div className="prevuser">
              {toshowPrevUsers.map((prevmail) => (
                <button
                  key={prevmail}
                  type="button"
                  className="todo__title prevuser__button"
                  onClick={() => {
                    ref.current.focus();
                    setEmail(prevmail);
                    setShowPrevUsers(false);
                    tempEmail = prevmail;
                  }}
                >
                  {prevmail}
                </button>
              ))}
              <p
                style={{
                  fontSize: '12px',
                  backgroundColor: 'white',
                  padding: '5px 15px',
                }}
              >
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
              onClick={() => {
                setNewUser(false);
                setEmailDisabled(false);
                setName('');
              }}
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
