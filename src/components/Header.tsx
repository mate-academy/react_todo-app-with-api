import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTodosContext } from '../context/useTodosContext';
import { USER_ID, addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    handleError,
    setLoadingTodosIds,
    isInputFocused,
    setIsInputFocused,
    toggleTodo,
    loadingTodosIds,
  } = useTodosContext();
  const [title, setTitle] = useState('');
  const focusField = useRef<HTMLInputElement>(null);
  const isAllCompleted = todos.every((todo: Todo) => todo.completed);
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);

  useEffect(() => {
    if (isInputFocused && focusField.current) {
      focusField.current.focus();
      setIsInputFocused(false);
    }
  }, [isInputFocused, setIsInputFocused]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      handleError(Error.title);

      return;
    }

    const newTodo = {
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    const tempTodo = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(tempTodo);
    setLoadingTodosIds(currentIds => [...currentIds, tempTodo.id]);

    addTodo(newTodo)
      .then(todoFromResponse => {
        setTodos(currentTodos => [...currentTodos, todoFromResponse]);
        setTitle('');
      })
      .catch(() => handleError(Error.addTodo))
      .finally(() => {
        setTempTodo(null);
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== tempTodo.id),
        );
        setIsInputFocused(true);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle('');
      setIsInputFocused(true);
    }
  };

  const toggleAllTodos = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(todo => toggleTodo(todo));
    } else {
      completedTodos.forEach(todo => toggleTodo(todo));
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          onKeyUp={handleKeyUp}
          disabled={loadingTodosIds.length !== 0}
        />
      </form>
    </header>
  );
};
