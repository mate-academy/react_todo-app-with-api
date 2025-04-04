import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  handleForm: (event: React.FormEvent) => void;
  errorGetTodos: () => void;
  setCreateNewTodos: Dispatch<SetStateAction<string>>;
  createNewTodos: string;
  inputRef: React.RefObject<HTMLInputElement>;
  loadingNewItem: boolean;
  toggleAllTodos: () => void;
  todoItem: Todo[];
}

export const Header: React.FC<HeaderProps> = ({
  handleForm,
  errorGetTodos,
  setCreateNewTodos,
  createNewTodos,
  inputRef,
  loadingNewItem,
  toggleAllTodos,
  todoItem,
}) => {
  useEffect(() => {
    if (!loadingNewItem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loadingNewItem]);

  const isAllCompleted =
    todoItem.length > 0 && todoItem.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todoItem.length > 0 && !loadingNewItem && (
        <button
          type="button"
          className={`todoapp__toggle-all${isAllCompleted ? ' active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form
        onSubmit={event => {
          handleForm(event);
          errorGetTodos();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={createNewTodos}
          onChange={event => setCreateNewTodos(event.target.value)}
          ref={inputRef}
          autoFocus
          disabled={loadingNewItem}
        />
      </form>
    </header>
  );
};
