import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTodos } from '../../utils/TodoContext';
import { USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    setError,
    isLoading,
    query,
    setQuery,
    setTempTodo,
    addTodo,
    toggleAllTodos,
  } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);
  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const isShowToggleAll = todos.length > 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const isQueryValid = !!query.trim();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isQueryValid) {
      setError(ErrorMessage.TITLE_IS_EMPTY);

      return;
    }

    const newTodo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    addTodo(newTodo);
  };

  const toggleCompletedAll = () => {
    toggleAllTodos(!isAllTodosCompleted);
  };

  return (
    <header className="todoapp__header">
      {isShowToggleAll && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleCompletedAll}
        />
      )}

      <form name="todo-text" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={query}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
