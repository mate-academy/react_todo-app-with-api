import React from 'react';
import { TodoStatistics } from '../../types/TodoStatistics';
import { LinkMode } from '../../types/LinkMode';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosCount: TodoStatistics;
  activeLink: LinkMode;
  changeActiveLink: (link: LinkMode) => void;
  todos: Todo[];
  deleteTodo: (id: number) => void;
  getComplitedTodos: (todos: Todo[]) => Todo[];
};

export const TodoFooter: React.FC<Props> = ({
  todosCount,
  activeLink,
  changeActiveLink,
  deleteTodo,
  todos,
  getComplitedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${[todosCount.active]} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(LinkMode).map(entry => {
          const [name, link] = entry;
          const capitalizeName = name[0].toUpperCase() + name.slice(1);

          return (
            <a
              href={`#/${link}`}
              className={cn('filter__link', {
                selected: activeLink === link,
              })}
              data-cy={`FilterLink${capitalizeName}`}
              key={link}
              onClick={() => changeActiveLink(link)}
            >
              {capitalizeName}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCount.all === todosCount.active}
        onClick={() => {
          const complitedTodos = getComplitedTodos(todos);

          complitedTodos.forEach(todo => deleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
