import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../TodoContext';
import { TodoStatus } from '../types/TodoStatus';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/Error';

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
      todo => deleteTodo(todo.id).then(() => {
        setTodos(prevTodos => prevTodos.filter(
          currentTodo => currentTodo.id !== todo.id,
        ));
      })
        .catch(() => setError(Error.DeleteTodo))
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
            'filter__link', { selected: selectedType === TodoStatus.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedType(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: selectedType === TodoStatus.Active },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedType(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: selectedType === TodoStatus.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedType(TodoStatus.Completed)}
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
