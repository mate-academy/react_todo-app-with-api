import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { getTodosByCompletion, removeTodo } from '../../api/todos';
import { Filter } from '../Filter/Filter';
import { filterByContext } from '../FilterContext/FilterContext';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  todosFromServer: Todo[],
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>,
  loadTodos: (id: number) => Promise<void>,
}

export const Footer: FC<Props> = ({
  todosFromServer,
  onFilterChange,
  loadTodos,
}) => {
  const currentFilter = useContext(filterByContext);
  const user = useContext(AuthContext);
  const completedTodos = getTodosByCompletion(todosFromServer, true);

  const hadleDeleteCompleted = () => {
    const deletePromises = getTodosByCompletion(todosFromServer, true)
      .map(todo => removeTodo(todo.id));

    Promise.all(deletePromises).then(() => {
      if (user) {
        loadTodos(user.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosFromServer.length} items left`}
      </span>

      <Filter
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !completedTodos.length,
          },
        )}
        onClick={hadleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
