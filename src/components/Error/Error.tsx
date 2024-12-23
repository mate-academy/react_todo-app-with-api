import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoProvider';

export const Errors = () => {
  const { errorMessage, setErrorMessage } = useTodoContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        id="Error"
        name="Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
