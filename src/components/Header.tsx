import cn from 'classnames';
import { FC, useMemo } from 'react';
import { LoadError } from '../types/LoadError';
import { Todo } from '../types/Todo';
import { NewTodoForm } from './NewTodoForm';

interface Props {
  todos: Todo[],
  addNewTodo: (title: string) => Promise<boolean>,
  setError: React.Dispatch<React.SetStateAction<LoadError>>,
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>
  setCurrentlyLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>
}

export const Header:FC<Props> = (
  {
    todos,
    addNewTodo,
    setError,
    editTodoByID,
    setCurrentlyLoadingTodos,
  },
) => {
  const isTodosExists = todos.length > 0;

  const isAllTodosCompleted = useMemo(() => (
    todos.every(currentTodo => (
      currentTodo.completed === true
    ))
  ), [todos]);

  const allTodosIDs = useMemo(() => (
    todos.map(todo => todo.id)
  ), [todos]);

  const toggleAllHandler = async () => {
    setCurrentlyLoadingTodos(allTodosIDs);

    await Promise.all(
      todos.map(currentTodo => {
        const { id, completed } = currentTodo;

        return completed && !isAllTodosCompleted
          ? editTodoByID(id, { completed })
          : editTodoByID(id, { completed: !completed });
      }),
    );

    setCurrentlyLoadingTodos([]);
  };

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
