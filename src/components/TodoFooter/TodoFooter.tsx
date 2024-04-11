import React from 'react';

import { useTodos } from '../context/TodosContext';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export const TodoFooter: React.FC = () => {
  const { todos, handleClearCompleted } = useTodos();

  const isCompletedTodos = todos.some(todo => todo.completed);
  const activeTodosTotal = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosTotal} items left
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
