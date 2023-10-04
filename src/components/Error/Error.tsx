/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useTodos } from '../../TodoContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
