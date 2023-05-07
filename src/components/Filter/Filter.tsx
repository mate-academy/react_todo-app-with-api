import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import { TodoList } from '../TodoList/TodoList';
import { Todo, FILTERS } from '../../types/types';

const LINKS = [
  {
    to: '/',
    recentFilter: FILTERS.all,
  },
  {
    to: '/active',
    recentFilter: FILTERS.active,
  },
  {
    to: '/completed',
    recentFilter: FILTERS.completed,
  },
];

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  activeIds: number[];
  handleRemoveTodo: (id: number) => void;
  handleClearCompleted: () => void;
  handleCheckboxChange: (todo: Todo) => void;
  handleTitleChange: (todo: Todo) => void;
};

export const Filter: FC<Props> = ({
  todos,
  tempTodo,
  activeIds,
  handleRemoveTodo,
  handleClearCompleted,
  handleCheckboxChange,
  handleTitleChange,
}) => {
  const [filter, setFilter] = useState<FILTERS>(FILTERS.all);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      if (filter === FILTERS.all) {
        return true;
      }

      return filter === FILTERS.completed
        ? todo.completed
        : !todo.completed;
    })
  ), [todos, filter]);

  const completedTodosCount = useMemo(() => (
    todos.filter(todo => todo.completed).length
  ), [todos]);

  const incompletedTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const handleFilterChange = (selectedFilter: FILTERS) => {
    setFilter(selectedFilter);
  };

  return (
    <>
      <TodoList
        visibleTodos={visibleTodos}
        tempTodo={tempTodo}
        activeIds={activeIds}
        handleRemoveTodo={handleRemoveTodo}
        handleCheckboxChange={handleCheckboxChange}
        handleTitleChange={handleTitleChange}
      />

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${incompletedTodosCount} items left`}
        </span>

        <nav className="filter">
          {LINKS.map(({ to, recentFilter }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (cn(
                'filter__link',
                { selected: isActive },
              ))}
              onClick={() => handleFilterChange(recentFilter)}
            >
              {recentFilter}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={!completedTodosCount}
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
