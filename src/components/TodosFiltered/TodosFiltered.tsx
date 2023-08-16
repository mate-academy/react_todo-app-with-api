import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setErrorMessage: (a: string) => void;
  allTodos: Todo[];
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  setTodos,
  setAllTodos,
  allTodos,
  setErrorMessage,
}) => {
  enum Status {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed',
  }
  const [filterBy, setFilterBy] = useState<Status>();

  const getFilteredTodos = (filter: Status) => {
    let filteredTodos: Todo[] = [];

    switch (filter) {
      case Status.ALL:
        filteredTodos = allTodos;
        break;
      case Status.ACTIVE:
        filteredTodos = allTodos.filter(todo => todo.completed === false);
        break;
      case Status.COMPLETED:
        filteredTodos = allTodos.filter(todo => todo.completed);
        break;
      default:
        filteredTodos = allTodos;
        break;
    }

    setTodos(filteredTodos);
  };

  const handleRemoveAllCompleted = async () => {
    try {
      const completedTodos = allTodos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(todo => client.delete(`/todos/${todo.id}`)));

      setAllTodos(prevTodos => prevTodos.filter(
        todo => !completedTodos.includes(todo),
      ));
    } catch (error) {
      setErrorMessage('Unable to remove completed todos');
      // eslint-disable-next-line no-console
      console.error('An error occurred:', error);
    }
  };

  const handleSetFilteredTodos
    = (filter: Status) => {
      setFilterBy(filter);
      getFilteredTodos(filter);
    };

  const completedTodoLength
    = useMemo(() => allTodos.filter(todo => todo.completed).length, [todos]);

  const uncompletedTodos
    = useMemo(() => allTodos.filter(todo => !todo.completed).length, [todos]);

  const todoLength = useMemo(() => allTodos.length, [todos]);

  return (
    (todoLength > 0) ? (
      <>
        <span className="todo-count">
          {`${uncompletedTodos} items left`}
        </span>
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: (filterBy === Status.ALL),
          })}
          onClick={() => handleSetFilteredTodos(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/completed"
          className="filter__link"
          onClick={() => {
            if (completedTodoLength > 0) {
              handleSetFilteredTodos(Status.COMPLETED);
            } else {
              handleSetFilteredTodos(Status.ALL);
            }
          }}
        >
          Completed
        </a>

        <a
          href="#/active"
          className="filter__link"
          onClick={() => handleSetFilteredTodos(Status.ACTIVE)}
        >
          Active
        </a>

        <button
          type="button"
          className="clear-completed"
          onClick={handleRemoveAllCompleted}
          disabled={!completedTodoLength}
        >
          Clear completed
        </button>

      </>
    ) : null);
};
