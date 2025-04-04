import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useTodosContext } from '../../hook/useTodosContext';
export const Header = () => {
  const {
    filteredTodos,
    error,
    activeTodos,
    toggleCompleted,
    handleNewTodo,
    title,
    handleTitle,
    isLoading,
  } = useTodosContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [filteredTodos.length, error]);

  const hasAllTodosCompleted = filteredTodos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {activeTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleCompleted()}
        />
      )}

      <form onSubmit={event => handleNewTodo(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => handleTitle(event)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
