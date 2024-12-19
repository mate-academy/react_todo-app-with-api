import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  titleTodo: string;
  setTitleTodo: React.Dispatch<React.SetStateAction<string>>;
  toggleAllTodos: () => void;
  activeTodos: number;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  isLoading,
  titleTodo,
  setTitleTodo,
  toggleAllTodos,
  activeTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [todos, isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodos === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={event => {
            setTitleTodo(event.target.value);
          }}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
