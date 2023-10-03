/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useTodosProvider } from '../../providers/TodosContext';

export const ErrorNotification: React.FC
  = () => {
    const { hideError, isError, error } = useTodosProvider();

    const handleHideError = () => {
      hideError();
    };

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {error}
      </div>
    );
  };
