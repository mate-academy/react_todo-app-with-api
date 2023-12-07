import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

function filterTodos(
  todos: Todo[],
  filterBy: Filter,
): Todo[] {
  let filteredTodos = [...todos];

  switch (filterBy) {
    case Filter.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;

    case Filter.Completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;

    default:
      break;
  }

  return filteredTodos;
}

type Props = {
  todos: Todo[],
  setFilteredTodos: (todos: Todo[]) => void,
  onDelete: (id: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilteredTodos,
  onDelete,
}) => {
  const [filterBy, setFilterBy] = useState(Filter.All);

  useEffect(() => {
    const filteredTodos = filterTodos(todos, filterBy);

    setFilteredTodos(filteredTodos);
  }, [todos, filterBy, setFilteredTodos]);

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const deleteAllCompleted = async () => {
    const allCompleted = todos.filter(t => t.completed);

    await Promise.allSettled(allCompleted.map(todo => (
      onDelete(todo.id)
    )));
  };

  const noCompleted = !todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === filterBy,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterBy(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: noCompleted,
        })}
        data-cy="ClearCompletedButton"
        disabled={noCompleted}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
