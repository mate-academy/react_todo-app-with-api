import classNames from 'classnames';
import { useTodos } from '../../TodosContext';

export const Error = () => {
  const { error, handleClearError } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClearError}
        aria-label="Hide Error"
      />
      {error}
    </div>
  );
};
