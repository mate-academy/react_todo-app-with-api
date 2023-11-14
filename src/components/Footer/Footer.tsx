import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  changeQuery: (query: string) => void,
  isCompletedTodo: boolean,
  numberActive: number,
  status: string,
  todos: Todo[],
  setDate: (date: Date) => void,
  setErrorMassege: (error: string) => void,
  setIsSpinner: (value: boolean) => void,
};

enum StatusTodos {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const Footer: React.FC<Props> = ({
  changeQuery,
  isCompletedTodo,
  numberActive,
  status,
  todos,
  setDate,
  setErrorMassege,
  setIsSpinner,
}) => {
  const handleClickAll = () => {
    changeQuery(StatusTodos.all);
  };

  const handleClickActive = () => {
    changeQuery(StatusTodos.active);
  };

  const handleClickCompleted = () => {
    changeQuery(StatusTodos.completed);
  };

  const handleClickDeleteCompletedTodos = () => {
    setIsSpinner(true);
    const promises = todos.map(todo => {
      if (todo.completed) {
        return deleteTodo(todo.id);
      }

      return false;
    });

    Promise.all(promises)
      .then(() => setDate(new Date()))
      .catch(() => setErrorMassege('Unable to delete a todos'))
      .finally(() => setIsSpinner(false));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberActive} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          onClick={handleClickAll}
          href="#/"
          className={`filter__link ${status === StatusTodos.all && 'selected'}`}
        >
          All
        </a>

        <a
          onClick={handleClickActive}
          href="#/active"
          className={`filter__link ${status === StatusTodos.active && 'selected'}`}
        >
          Active
        </a>

        <a
          onClick={handleClickCompleted}
          href="#/completed"
          className={`filter__link ${status === StatusTodos.completed && 'selected'}`}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        style={{ visibility: `${isCompletedTodo ? 'visible' : 'hidden'}` }}
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClickDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
