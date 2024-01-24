import cn from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from './TodoProvider';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        aria-label="deleteError"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
