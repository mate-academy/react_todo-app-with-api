import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todosFromServer: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  deleteTodo: (id: number, todo: Todo) => void;
};

enum TypeFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

function getCount(serverTodos: Todo[] | null) {
  let count = 0;

  if (serverTodos && serverTodos.length > 0) {
    serverTodos.forEach(todo => {
      if (todo.completed === false) {
        count++;
      }
    });
  }

  return count;
}

type ArrayButtons = {
  title: string;
  href: string;
  typeFilter: TypeFilter;
  id: number;
  link: string;
};

const arrayButtons: ArrayButtons[] = [
  {
    title: 'All',
    href: '#/',
    typeFilter: TypeFilter.All,
    id: 1,
    link: 'FilterLinkAll',
  },
  {
    title: 'Active',
    href: '#/active',
    typeFilter: TypeFilter.Active,
    id: 2,
    link: 'FilterLinkActive',
  },
  {
    title: 'Completed',
    href: '#/completed',
    typeFilter: TypeFilter.Completed,
    id: 3,
    link: 'FilterLinkCompleted',
  },
];

export const Filter: React.FC<Props> = ({
  setTodos,
  todosFromServer,
  deleteTodo,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(TypeFilter.All);

  const filtrationTodos = useCallback(
    (buttonType: TypeFilter) => {
      if (todosFromServer) {
        if (buttonType === TypeFilter.Active) {
          const newTodos: Todo[] = todosFromServer.filter((todo: Todo) => {
            return todo.completed === false;
          });

          setTodos(newTodos);
        } else if (buttonType === TypeFilter.Completed) {
          const newTodos: Todo[] = todosFromServer.filter((todo: Todo) => {
            return todo.completed === true;
          });

          setTodos(newTodos);
        } else {
          setTodos(todosFromServer);
        }
      }
    },
    [todosFromServer, setTodos],
  );

  useEffect(() => {
    filtrationTodos(selectedFilter);
  }, [todosFromServer]);

  const clearCompleted = useCallback(async () => {
    if (todosFromServer) {
      const needDelete = todosFromServer
        .filter(todo => todo.completed === true)
        .map((todo: Todo) => {
          return deleteTodo(todo.id, todo);
        });

      await Promise.all(needDelete);
    }
  }, [todosFromServer, deleteTodo]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getCount(todosFromServer)} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {arrayButtons.map(button => (
          <a
            href={button.href}
            key={button.id}
            className={classNames('filter__link', {
              selected: selectedFilter === button.typeFilter,
            })}
            data-cy={button.link}
            onClick={e => {
              e.preventDefault();
              filtrationTodos(button.typeFilter);
              setSelectedFilter(button.typeFilter);
            }}
          >
            {button.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosFromServer?.some(todo => todo.completed === true)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
