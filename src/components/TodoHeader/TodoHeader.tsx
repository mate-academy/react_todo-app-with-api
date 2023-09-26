/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTodos } from '../../TodosContext';

export const TodoHeader: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedTitle = title.trim();
  const {
    todos,
    tempTodos,
    filter,
    isAllTodosCompleted,
    isTitleFieldFocused,
    handlerTitleFieldFocused,
    handleToggleAllTodos,
    handleAddTodo,
  } = useTodos();

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoInputRef.current && isTitleFieldFocused) {
      todoInputRef.current.focus();
    }
  }, [tempTodos, filter, isAllTodosCompleted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (trimmedTitle) {
      setIsLoading(true);
    }

    const response = await handleAddTodo(trimmedTitle);

    if (response) {
      setTitle('');
    }

    setIsLoading(false);
    handlerTitleFieldFocused(true);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length)
        && (
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: isAllTodosCompleted },
            )}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllTodos}
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
