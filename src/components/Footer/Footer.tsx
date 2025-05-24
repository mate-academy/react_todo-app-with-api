import React from 'react';
import { FilterOptions } from '../../types/FilterOptions';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  todosFilter: FilterOptions;
  errorMessage: string;
  setTodos: (todos: Todo[]) => void;
  setTodosFilter: (filterState: FilterOptions) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  todosFilter,
  setTodos,
  setTodosFilter,
  setErrorMessage,
  inputRef,
}) => {
  const visibleClearButton = todos.some(todo => todo.completed);

  async function deleteCompletedTodos() {
    const preparedTodos: Todo[] = [];

    for (const todo of todos) {
      if (!todo.completed) {
        preparedTodos.push(todo);
      } else {
        await deleteTodo(todo.id)
          .then(() => {})
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            preparedTodos.push(todo);
          });
      }
    }

    setTodos(preparedTodos);
    inputRef.current?.focus();
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(option => {
          return (
            <a
              href={`#/${option}`}
              className={cn('filter__link', {
                selected: option === todosFilter,
              })}
              data-cy={`FilterLink${option}`}
              key={option}
              onClick={() => setTodosFilter(option)}
            >
              {option}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!visibleClearButton}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
