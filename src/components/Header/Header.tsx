import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useTodos } from '../../TodosContext';
import { USER_ID } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    todos,
    tempTodo,
    isSubmitting,
    handleCreateTodo,
    handleToggleAllComplete,
  } = useTodos();

  const [title, setTitle] = useState('');
  const inputElement = useRef<HTMLInputElement | null>(null);
  const isEveryTodosCompleted = todos.every(todo => todo.completed);

  function markAllComplete() {
    handleToggleAllComplete(todos);
  }

  function reset() {
    setTitle('');
  }

  const handleSubmitTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      await handleCreateTodo({
        title: title,
        userId: USER_ID,
        completed: false,
      })
    ) {
      reset();
    }
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, [todos.length, tempTodo]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isEveryTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={markAllComplete}
        />
      )}

      <form onSubmit={handleSubmitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={isSubmitting}
          ref={inputElement}
          autoFocus
        />
      </form>
    </header>
  );
};
