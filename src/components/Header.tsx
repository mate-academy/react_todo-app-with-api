import React from 'react';

type Props = {
  todos: { completed: boolean }[];
  handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  isLoading,
  inputRef,
  onToggleAll,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
