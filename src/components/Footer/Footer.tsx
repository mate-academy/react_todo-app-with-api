import React from 'react';
import { Filter } from '../Filter';
import { useTodos } from '../TodosProvider';

export const Footer: React.FC = () => {
  const { todos, clearCompletedTodos, setSelectedTodoIds } = useTodos();

  const quantityTodos = todos.filter(todo => !todo.completed).length;
  const hasOnlyNotCompletedTodos = todos.every(todo => !todo.completed);

  const handleClearCompleted = async () => {
    setSelectedTodoIds(
      todos.filter(todo => todo.completed).map(todo => todo.id),
    );
    try {
      await clearCompletedTodos();
    } finally {
      setSelectedTodoIds([]);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {quantityTodos} items left
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={hasOnlyNotCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
