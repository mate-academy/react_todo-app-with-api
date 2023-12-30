import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const TodoToggleAllButton = () => {
  const { todos, handleToggleAll } = useContext(TodosContext);
  const activeSomeTask = todos.every(todo => todo.completed);

  return (
    <button
      type="button"
      className={classNames(
        'todoapp__toggle-all', {
          active: activeSomeTask,
        },
      )}
      data-cy="ToggleAllButton"
      aria-label="Toggle All"
      onClick={handleToggleAll}
    />
  );
};
