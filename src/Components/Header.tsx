import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type HeaderProps = {
  todosDb: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  inputLoading: boolean;
  addTodo: (e: React.FormEvent<HTMLFormElement>, title: string) => void;
  setError: (error: string | null) => void;
  completeTodo: (id: number, completed: boolean) => void;
  setTodosDb: (todos: Todo[]) => void;
};

const Header: React.FC<HeaderProps> = ({
  todosDb,
  newTodoTitle,
  setNewTodoTitle,
  inputLoading,
  addTodo,
  setError,
  completeTodo,
  setTodosDb,
}) => {
  const handleToggleAll = async () => {
    setError(null);
    try {
      if (
        !todosDb.some(todo => todo.completed) ||
        !todosDb.some(todo => !todo.completed)
      ) {
        await Promise.all(
          todosDb.map(todo => completeTodo(todo.id, !todo.completed)),
        );
        setTodosDb(
          todosDb.map(todo => ({
            ...todo,
            completed: !todo.completed,
          })),
        );

        return;
      } else {
        await Promise.all(
          todosDb
            .filter(todo => !todo.completed)
            .map(todo => completeTodo(todo.id, !todo.completed)),
        );
        setTodosDb(
          todosDb.map(todo => ({
            ...todo,
            completed: true,
          })),
        );
      }
    } catch (err) {
      setError('Unable to toggle all todos');
    }
  };

  return (
    <header className="todoapp__header">
      {todosDb.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosDb.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={e => addTodo(e, newTodoTitle)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={inputLoading}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
