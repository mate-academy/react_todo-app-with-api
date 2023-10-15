import React from 'react';
import { useTodos } from '../Context';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    handleInputChange,
    handleCreateTodo,
    newTodo,
    disableInput,
    toggleAll,
    allCompleted,
    headerInputRef,
  } = useTodos();

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${(allCompleted) && 'active'}`}
          aria-label="btn"
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleCreateTodo}>
        <input
          ref={headerInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
