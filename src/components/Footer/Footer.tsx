import React, { useContext, useCallback, useMemo } from 'react';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { Navigation } from './Navigation';

export const Footer: React.FC = React.memo(() => {
  const { todos } = useContext(TodoContext);
  const { deleteTodos, setActiveIds } = useContext(TodoUpdateContext);
  const isCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );
  const items = useMemo(
    () => todos.filter(todo => !todo.completed).length, [todos],
  );

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
