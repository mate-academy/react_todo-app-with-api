import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { handleError } from '../../services/ErrorHandling';
import { ErrorEnum, ErrorType } from '../../types/Error';
import { Filter } from '../../types/Filter';

interface Props {
  todosList: Todo[];
  todosCounter: number;
  filter: Filter;
  onDelete: (id: number) => void;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  setActiveTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorType: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setErrorCounter: React.Dispatch<React.SetStateAction<number>>;
}

const filterArray = ['All', 'Active', 'Completed'];

export const Footer: React.FC<Props> = ({
  todosList,
  todosCounter,
  filter,
  onDelete,
  setActiveTodo,
  setFilter,
  setErrorType,
  setErrorCounter,
}) => {
  const clearCompleted = async () => {
    const completedTodos = [...todosList].filter(current => current.completed);
    const promiseArray = completedTodos.map((todo: Todo) => onDelete(todo.id));

    setActiveTodo([...completedTodos]);

    try {
      await Promise.all([...promiseArray]);
    } catch (error) {
      setErrorCounter(current => {
        const newValue = current + 1;

        handleError(setErrorType, {
          type: ErrorEnum.DELETE,
          errorAmount: newValue,
        });

        return newValue;
      });
      throw error;
    }
  };

  const filterTodos = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const filterParam: string = event.currentTarget.textContent;

    if (filterParam === Filter.ALL) {
      setFilter(Filter.ALL);
    }

    if (filterParam === Filter.ACTIVE) {
      setFilter(Filter.ACTIVE);
    }

    if (filterParam === Filter.COMPLETED) {
      setFilter(Filter.COMPLETED);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterArray.map((filterLink: string) => {
          return (
            <a
              key={filterLink}
              href={
                filterLink !== 'All' ? `#/${filterLink.toLowerCase()}` : '#/'
              }
              className={classNames('filter__link', {
                selected: filter === filterLink,
              })}
              data-cy={`FilterLink${filterLink}`}
              onClick={filterTodos}
            >
              {filterLink}
            </a>
          );
        })}
      </nav>

      <button
        disabled={todosCounter === todosList.length}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
