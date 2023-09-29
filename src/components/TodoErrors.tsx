/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';

type TodoErrorProps = {
  error: string | null;
  onClose: () => void;
};

export const TodoError: React.FC<TodoErrorProps> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === null,
        },
      )}
    >
      {error && (
        <div className="notification-content">
          {error}
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={onClose}
          />
        </div>
      )}
    </div>
  );
};
