import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTodosContext } from '../../context/TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    onHandleSubmit,
    isSubmitting,
    shouldClearInput,
    onHandleUpdateTodo,
  } = useTodosContext();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const allCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const toggleAllCompleted = () => {
    const targetCompletedState = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompletedState,
    );

    todosToUpdate.forEach(todo => {
      onHandleUpdateTodo(todo.id, todo.title, targetCompletedState);
    });
  };

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [todos, isSubmitting]);

  useEffect(() => {
    if (shouldClearInput) {
      setInputValue('');
    }
  }, [todos, shouldClearInput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onHandleSubmit(inputValue);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
