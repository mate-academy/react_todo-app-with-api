import React, { useEffect, useRef } from 'react';
import { useTodos } from '../Store/Store';

const Header: React.FC = () => {
  const { handleSubmit, query, handleChangeQuery, handleUpdateTodo, todos } =
    useTodos();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeCompleted = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    updatedTodos.forEach(todo => handleUpdateTodo(todo));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleChangeCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeQuery}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
