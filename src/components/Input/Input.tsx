/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef } from 'react';
import { useTodo } from '../../provider/todoProvider';

export const Input = () => {
  const {
    addNewTodo, newTodoName,
    setNewTodoName,
    allTodosAreActive,
    toggleActiveTodo,
    todos,
    temptTodo,
  } = useTodo();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0
          && (
            <button
              type="button"
              className={allTodosAreActive
                ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'}
              onClick={() => toggleActiveTodo()}
              data-cy="ToggleAllButton"
            />
          )}
      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoName?.trimStart() || ''}
          onChange={(e) => setNewTodoName(e.target.value)}
          disabled={!!temptTodo}
        />
      </form>
    </header>
  );
};
