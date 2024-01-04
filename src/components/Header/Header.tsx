import classNames from 'classnames';
import { useTodos } from '../../context';
import { AddTodoForm } from '../AddTodoForm';

export const Header = () => {
  const { inProgress, todos, updateAllTodoOnServer } = useTodos();

  const handleCompleteTodos = () => {
    updateAllTodoOnServer(true);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          aria-label="Add Todo"
          className={classNames(
            'todoapp__toggle-all',
            { active: !inProgress },
          )}
          data-cy="ToggleAllButton"
          onClick={handleCompleteTodos}
        />
      )}

      <AddTodoForm />
    </header>
  );
};
