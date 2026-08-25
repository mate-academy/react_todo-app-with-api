import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  todos: Todo[];
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  inputRef,
  inputValue,
  setInputValue,
  handleSubmit,
  isSubmitting,
  todos,
  onToggleAll,
}) => {
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
