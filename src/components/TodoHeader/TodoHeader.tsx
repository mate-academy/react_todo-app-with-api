import * as React from 'react';
import { Todo } from '../../types/Todo';

type TodoHeaderProps = {
  todos: Todo[];
  isAdding: boolean;
  handleToggleAll: () => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  isAdding,
  handleToggleAll,
  handleAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${
            todos.every(t => t.completed) ? 'active' : ''
          }`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          name="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
