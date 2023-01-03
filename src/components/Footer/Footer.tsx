import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { getTodosByCompletion, removeTodo } from '../../api/todos';
import { Filter } from '../Filter/Filter';
import { filterByContext } from '../FilterContext/FilterContext';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoErrors } from '../../types/ErrorMessages';

interface Props {
  onError: React.Dispatch<React.SetStateAction<TodoErrors>>,
  onMultipleLoad: React.Dispatch<React.SetStateAction<number[]>>,
  todosFromServer: Todo[],
  onFilterChange: React.Dispatch<React.SetStateAction<FilterOptions>>,
  loadTodos: (id: number) => Promise<void>,
}

export const Footer: FC<Props> = ({
  onError,
  onMultipleLoad,
  todosFromServer,
  onFilterChange,
  loadTodos,
}) => {
  const currentFilter = useContext(filterByContext);
  const user = useContext(AuthContext);
  const completedTodos = getTodosByCompletion(todosFromServer, true);

  const handleTodoDeletion = async () => {
    onMultipleLoad(completedTodos.map(todo => todo.id));

    const deletePromises = completedTodos
      .map(todo => removeTodo(todo.id));

    try {
      await Promise.all(deletePromises);

      if (user) {
        loadTodos(user.id);
      }
    } catch (error) {
      onError(TodoErrors.onDelete);
    } finally {
      onMultipleLoad([]);
    }
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
        onClick={handleTodoDeletion}
      >
        Clear completed
      </button>
    </footer>
  );
};
