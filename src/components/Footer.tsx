import { useEffect, useState } from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface FooterProps {
  setFilter: (filter: Filter) => void,
  filter: Filter,
  todos: Todo[],
  removeAllCompleted: () => void,
}

export const Footer: React.FC<FooterProps> = ({
  setFilter, filter, todos, removeAllCompleted,
}) => {
  const [areCompleted, setAreCompleted]
    = useState(todos.some(todo => todo.completed));

  useEffect(() => {
    setAreCompleted(todos.some(todo => todo.completed));
  }, [todos]);

  const filterTodos: string = (() => {
    const listLength = todos.filter(todo => !todo.completed).length;
    const itemOrS = `item${listLength > 1 ? 's' : ''}`;

    return `${listLength} ${itemOrS} left`;
  })();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {filterTodos}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.all ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.active ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.completed ? 'selected' : ''}`}
          onClick={() => setFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>
      {areCompleted
       && (
         <button
           type="button"
           className="todoapp__clear-completed"
           onClick={removeAllCompleted}
         >
           Clear completed
         </button>
       )}
    </footer>
  );
};
