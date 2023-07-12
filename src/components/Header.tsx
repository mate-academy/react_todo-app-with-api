import cn from 'classnames';
import { FC, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { NewTodoForm } from './NewTodoForm';
import { checkIfAllTodosCompleted } from '../utils/checkIfAllTodosCompleted';

interface Props {
  todos: Todo[],
  addNewTodo: (title: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  toggleAllHandler: () => Promise<void>
}

export const Header:FC<Props> = (
  {
    todos,
    addNewTodo,
    setError,
    toggleAllHandler,
  },
) => {
  const isTodosExists = todos.length > 0;

  const isAllTodosCompleted = useMemo(() => (
    checkIfAllTodosCompleted(todos)
  ), [todos]);

  return (
    <header className="todoapp__header">
      {isTodosExists && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          aria-label="Toggle all"
          onClick={toggleAllHandler}
        />
      )}

      <NewTodoForm
        addNewTodo={addNewTodo}
        setError={setError}
      />
    </header>
  );
};
