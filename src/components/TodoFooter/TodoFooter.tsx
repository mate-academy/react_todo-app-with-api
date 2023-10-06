import React, { useContext } from 'react';
import { TodosContext } from '../../TodoProvider';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export const TodoFooter: React.FC = () => {
  const { todos, setToDelete } = useContext(TodosContext);

  const handleClear = () => {
    setToDelete(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  };

  const checkCompleted = () => {
    return todos.some(todo => todo.completed);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos.filter(todo => !todo.completed).length}
        {' '}
        items left
      </span>

      <TodoFilter />

      {checkCompleted() && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClear}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
