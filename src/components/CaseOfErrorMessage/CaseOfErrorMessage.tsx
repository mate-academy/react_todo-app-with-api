/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

export const CaseOfErrorMessage = () => {
  const { error, closeErrorMessage } = useTodo();

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />

      {error}
    </div>
  );
};
