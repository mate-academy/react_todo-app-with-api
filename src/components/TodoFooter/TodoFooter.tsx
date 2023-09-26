import React, { useContext } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/TodoStatus';
import { getActiveTodoQuantity } from './helpers';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todos: Todo[]
}

export const TodoFooter: React.FC<Props> = ({ todos }) => {
  const {
    filterType,
    handleFilterChange,
    handleDeleteCompletedTodo,
  } = useContext(TodosContext);
  const activeTodoQuantity: number = getActiveTodoQuantity(todos);
  const itemForm = activeTodoQuantity === 1 ? 'item' : 'items';
  const message = `${activeTodoQuantity} ${itemForm} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {message}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType)
          .map(type => (
            <a
              key={type}
              href="#/"
              data-cy={`FilterLink${type}`}
              className={classNames(
                'filter__link',
                {
                  selected: type === filterType,
                },
              )}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </a>
          ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={activeTodoQuantity === todos.length}
        onClick={handleDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
