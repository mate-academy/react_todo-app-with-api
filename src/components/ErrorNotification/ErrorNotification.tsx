import cn from 'classnames';
import { useAppContext } from '../../AppContext';

export const ErrorNotification: React.FC = () => {
  const { error, setError } = useAppContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !error })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      >
        {' '}
      </button>
      {error}
    </div>
  );
};
