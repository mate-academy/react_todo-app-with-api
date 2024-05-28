import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Status } from '../../types/Status';
import * as todosService from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  statusFilter: Status;
  setStatusFilter: (newStatus: Status) => void;
  setErrorMessage: (errorMessage: string) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  statusFilter,
  setStatusFilter,
  setErrorMessage,
  setLoadingTodoIds,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const complitedTodosCount = todos.filter(todo => todo.completed).length;

  function removeTodo(todoId: number) {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    return todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      });
  }

  const handleClearButton = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      setLoadingTodoIds(prevIds => [...prevIds, todo.id]);

      removeTodo(todo.id)
        .then(() => {
          setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todo.id));
        })
        .catch(() => {
          setErrorMessage(`Unable to delete a todo`);
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <div>
          {Object.values(Status).map(status => (
            <a
              key={status}
              href={`#/${status.toLowerCase()}`}
              className={classNames('filter__link', {
                selected: statusFilter === status,
              })}
              data-cy={`FilterLink${status}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </a>
          ))}
        </div>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearButton}
        disabled={!complitedTodosCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
