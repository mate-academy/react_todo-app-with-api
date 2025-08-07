import React, { useEffect } from 'react';
import { HeaderProps } from './types/HeaderProps';
import { USER_ID } from './api/todos';
import classNames from 'classnames';

export const Header: React.FC<HeaderProps> = ({
  setError,
  newTodoTitle,
  setLoadingTodo,
  setTempTodo,
  setNewTodoTitle,
  loadingTodo,
  handleAddTodo,
  inputRef,
  todos,
  toggleAll,
  isTodosLoading,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadingTodo) {
        inputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loadingTodo, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      setTimeout(() => {
        setError(null);
      }, 3000);

      return;
    }

    setError(null);

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    const tempTask = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempTask);

    setLoadingTodo(true);
    handleAddTodo(newTodo.title);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && !isTodosLoading && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          disabled={loadingTodo}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
