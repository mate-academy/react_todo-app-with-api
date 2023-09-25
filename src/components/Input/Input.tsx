/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

export const Input = () => {
  const {
    addNewTodo,
    newTodo,
    setNewTodo,
    allTodosCompleted,
    toggleActiveTodo,
    todos,
    temptTodo,
    isFocusedOnTask,
  } = useTodo();

  return (
    <header className="todoapp__header">
      {todos.length !== 0
          && (
            <button
              type="button"
              className={allTodosCompleted
                ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'}
              onClick={() => toggleActiveTodo(todos)}
              data-cy="ToggleAllButton"
            />
          )}
      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          ref={input => !isFocusedOnTask && input && input.focus()}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo?.trimStart() || ''}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={!!temptTodo}
        />
      </form>
    </header>
  );
};
