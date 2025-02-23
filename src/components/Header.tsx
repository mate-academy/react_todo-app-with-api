import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  inputTodo: string;
  setInputTodo: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleEveryCompleted: (todosSelect: Todo[]) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

function Header({
  todos,
  inputTodo,
  setInputTodo,
  loading,
  handleEveryCompleted,
  handleKeyDown,
}: Props) {
  return (
    <header className="todoapp__header">
      {todos.length !== 0 && todos[0].id !== 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(el => el.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() => handleEveryCompleted(todos)}
        />
      )}

      <form>
        <input
          ref={reference => {
            reference?.focus();
          }}
          data-cy="NewTodoField"
          type="text"
          value={inputTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setInputTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </form>
    </header>
  );
}

export default Header;
