/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

export const Input = () => {
  const {
    addNewTodo, newTodoName,
    setNewTodoName,
    allTodosAreActive,
    toggleActiveTodo,
  } = useTodo();

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={allTodosAreActive
          ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'}
        onClick={() => toggleActiveTodo()}
      />

      <form onSubmit={addNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoName?.trimStart() || ''}
          onChange={(e) => setNewTodoName(e.target.value)}
        />
      </form>
    </header>
  );
};
