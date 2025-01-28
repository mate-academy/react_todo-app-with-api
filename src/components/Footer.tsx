import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';

type Props = {
  todos: Todo[];
  filterOption: FilterOptions;
  setFilterOption: (newFilterOption: FilterOptions) => void;
  onDelete: (todoIds: number[]) => void;
};

function Footer({ todos, filterOption, setFilterOption, onDelete }: Props) {
  const todosLeft = todos.filter(todo => !todo.completed);
  const todosCompleted = todos.filter(todo => todo.completed);

  const handleDeleteClick = () => {
    const todosCompletedId = todosCompleted.map(todo => todo.id);

    onDelete(todosCompletedId);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(option => (
          <a
            key={option}
            href="#/"
            className={cn('filter__link', {
              selected: filterOption === option,
            })}
            data-cy={'FilterLink' + option}
            onClick={() => setFilterOption(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosCompleted.length}
        onClick={handleDeleteClick}
      >
        Clear completed
      </button>
    </footer>
  );
}

const FooterMemo = React.memo(Footer);

export default FooterMemo;
