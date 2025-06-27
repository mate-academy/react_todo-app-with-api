import React, { FormEvent, useEffect, useRef } from 'react';
import { TodoType } from '../../types/TodoType';
import cn from 'classnames';

type HeaderProps = {
  todos: TodoType[];
  isLoading: boolean;
  todoDeleted: number;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitForm: (e: FormEvent) => void;
  handleUpdateTodos: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  isLoading,
  todoDeleted,
  query,
  setQuery,
  handleSubmitForm,
  handleUpdateTodos,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  const isToggleAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    inputField.current?.focus();
  }, [isLoading, todoDeleted]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleUpdateTodos()}
        />
      )}

      <form onSubmit={e => handleSubmitForm(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
