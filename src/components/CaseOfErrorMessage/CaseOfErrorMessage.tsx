/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

export const CaseOfErrorMessage = () => {
  const { error, closeErrorMessage } = useTodo();

  return (
    <div
      data-cy="ErrorNotification"
      className={error
        ? 'notification is-danger is-light has-text-weight-normal'
        : 'notification is-danger is-light has-text-weight-normal hidden'}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />

      {error}
    </div>
  );
};
