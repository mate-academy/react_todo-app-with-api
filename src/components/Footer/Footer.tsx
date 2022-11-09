import React, { useContext, useCallback } from 'react';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { Navigation } from './Navigation';

export const Footer: React.FC = React.memo(() => {
  const { todos } = useContext(TodoContext);
  const { deleteTodos, setActiveIds } = useContext(TodoUpdateContext);
  const isCompleted = todos.some(todo => todo.completed);
  const items = todos.filter(todo => !todo.completed).length;

  // delete completed todos
  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedId = completedTodos.map(todo => todo.id);

    setActiveIds(completedId);
    deleteTodos(completedId);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${items} items left`}
      </span>

      <Navigation />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
