import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  allCompleted: boolean;
  titlename: string;
  toggleAll: () => void;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  allCompleted,
  toggleAll,
  titlename,
  handleTitleChange,
  handleSubmitForm,
  isAdding,
  inputRef,
  loading,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {!loading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={toggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titlename}
          onChange={handleTitleChange}
          autoFocus
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
