import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  addingTodo: Todo | null;
  allCompletedTodos: boolean;
  isLoadingAll: boolean;
  todosCount: number;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmitForm: (event: React.FormEvent) => void;
  handleInputValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckedAll: () => void;
};

export const Header: React.FC<Props> = ({
  addingTodo,
  allCompletedTodos,
  isLoadingAll,
  todosCount,
  inputValue,
  inputRef,
  handleSubmitForm,
  handleInputValue,
  handleCheckedAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoadingAll && todosCount > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompletedTodos ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleCheckedAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputValue}
          disabled={!!addingTodo}
        />
      </form>
    </header>
  );
};
