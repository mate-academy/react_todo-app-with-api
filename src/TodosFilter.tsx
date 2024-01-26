import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { deleteTodos } from './api/todos';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  status: Status,
  setStatus: Dispatch<SetStateAction<Status>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  setChangedTodos: Dispatch<SetStateAction<number[]>>,
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  setStatus,
  setErrorMessage,
  setChangedTodos,
}) => {
  const handleStatus = (filter: Status) => () => setStatus(filter);

  const todosNotCompleted = todos.filter(todo => !todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const clearCompleted = async () => {
    const todosCompleted = todos.filter((todo) => todo.completed);
    const deletedIds: number[] = [];
    const errorIds: number[] = [];

    try {
      await Promise.all(
        todosCompleted.map(async (todo) => {
          setChangedTodos((prevChangedTodos) => [...prevChangedTodos, todo.id]);
          try {
            await deleteTodos(todo.id);
            deletedIds.push(todo.id);
          } catch (error) {
            errorIds.push(todo.id);
          }
        }),
      );

      if (errorIds.length > 0) {
        setErrorMessage('Unable to delete a todo');
      }

      // Remove successful todos
      const newTodos = todos.filter((todo) => {
        return !deletedIds.includes(todo.id) || errorIds.includes(todo.id);
      });

      setTodos(newTodos);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setChangedTodos(
        (prevChangedTodos) => prevChangedTodos
          .filter((id) => !deletedIds.includes(id)),
      );
    }
  };

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosNotCompleted.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">

        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          onClick={handleStatus(Status.all)}
        >
          {Status.all}
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          onClick={handleStatus(Status.active)}
        >
          {Status.active}
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          onClick={handleStatus(Status.completed)}
        >
          {Status.completed}
        </a>

      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
