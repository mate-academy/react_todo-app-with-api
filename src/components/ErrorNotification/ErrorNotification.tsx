/* eslint-disable react/display-name */
import classNames from 'classnames';
import React, { useContext } from 'react';
import { todosContext } from '../../Store';

type Props = { errorMessage: string };

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage }) => {
    const [store, setters] = useContext(todosContext);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !store.errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setters.setErrorMessage('')}
        />
        {errorMessage}
      </div>
    );
  },
);
