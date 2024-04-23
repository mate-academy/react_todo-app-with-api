/* eslint-disable react/display-name */
import classNames from 'classnames';
import React, { useContext } from 'react';
import { todosContext } from '../../Store';

type Props = { errorMessage: string };

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage }) => {
    const [store, setters] = useContext(todosContext);
    const { errorMessage: error } = store;
    const { setErrorMessage } = setters;

    const handleClick = () => setErrorMessage('');

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleClick}
        />

        {errorMessage}
      </div>
    );
  },
);
