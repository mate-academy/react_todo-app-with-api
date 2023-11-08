import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext';
import { Status } from '../types/Status';
import { removeTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const TodosFilter: React.FC = () => {
  const {
    todos,
    setTodos,
    setIsClearCompleted,
    setError,
    inputRef,
    selectedType,
    setSelectedType,
  } = useContext(TodoContext);

  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).map(
      todo => removeTodo(todo.id).then(() => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
      })
        .catch(() => setError(ErrorMessage.DeleteTodo))
        .finally(() => {
          setIsClearCompleted(false);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }),
    );

    setIsClearCompleted(true);
  };

  const unCompletedCount = todos.filter(
    todo => todo.completed === false,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link', { selected: selectedType === Status.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedType(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: selectedType === Status.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedType(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: selectedType === Status.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedType(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodo}
      >
        Clear completed
      </button>

    </footer>
  );
};
