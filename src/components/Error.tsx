import { useContext } from 'react';
import { TodoContext } from './TodoContext';
import cn from 'classnames';

export const Error: React.FC = () => {
  const { error } = useContext(TodoContext);

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
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
