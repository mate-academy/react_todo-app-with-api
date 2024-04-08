import React from 'react';
import { FilterTodos } from './FilterTodos';
import { useTodosContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';

interface Props {
  itemsLeft: Todo[];
}

export const Footer: React.FC<Props> = ({ itemsLeft }) => {
  const { todos, handleDeleteTodoFooter } = useTodosContext();

  const completedTodos = todos.filter(todo => todo.completed);

  const hendlerDeleteTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodoFooter(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <FilterTodos />
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={hendlerDeleteTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
