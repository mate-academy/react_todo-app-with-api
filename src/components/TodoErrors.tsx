import { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from './Todos.Context';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoErrors: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  return (
    <>
      <div
        data-cy="ErrorNotification"
        // eslint-disable-next-line max-len
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </>
  );
};
