import React from 'react';
import { FilterType, Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  setFilteredTodos: (filterType: FilterType) => void,
  handleDeleteTodo: (todoId: number) => void;
}

export const TodoFooter: React.FC<Props> = (props) => {
  const { todos, setFilteredTodos, handleDeleteTodo } = props;

  const handleClear = () => {
    todos.forEach(el => {
      if (el.completed === true) {
        handleDeleteTodo(el.id);
      }
    });
  };

  const completedTodos = todos.filter(el => el.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos.length - completedTodos.length}
        {' '}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className="filter__link selected"
          onClick={() => setFilteredTodos(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className="filter__link"
          onClick={() => setFilteredTodos(FilterType.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className="filter__link"
          onClick={() => setFilteredTodos(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleClear()}
      >
        {completedTodos.length !== 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
