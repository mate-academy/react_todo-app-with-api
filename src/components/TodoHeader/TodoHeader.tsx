import { TodoForm } from '../TodoForm/TodoForm';

import cn from 'classnames';

import { useTodos } from '../context/TodosContext';

export const TodoHeader = () => {
  const { todos, toggleAll } = useTodos();

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <TodoForm />
    </header>
  );
};
