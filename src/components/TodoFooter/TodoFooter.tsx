import React, { Dispatch, SetStateAction, useContext } from 'react';
import cn from 'classnames';
import { Status } from '../../types/FilterOptions';
import { ErrorMessage } from '../../types/ErrorMessages';
import { TodosContext } from '../TodosContext';
import { deleteTodo } from '../../api/todos';
import { filters } from '../../utils/filters';

type Props = {
  currentFilter: Status;
  onFilterChange: Dispatch<SetStateAction<Status>>;
};

export const TodoFooter: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
}) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setErrorWithTimeout,
  } = useContext(TodosContext);

  const completedTodos = todos?.filter(todo => todo.completed);
  const notCompletedTodos = todos?.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedIds.forEach(todoId => {
      deleteTodo(todoId.toString())
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setErrorWithTimeout(ErrorMessage.Deleting, setErrorMessage);
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${notCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.id}
            data-cy={filter.id}
            href={filter.href}
            className={cn('filter__link',
              { selected: currentFilter === filter.status })}
            onClick={() => onFilterChange(filter.status)}
          >
            {filter.text}
          </a>
        ))}
      </nav>

      <button
        style={{
          visibility: completedTodos.length > 0 ? 'visible' : 'hidden',
        }}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
