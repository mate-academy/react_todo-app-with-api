import React, { useContext, useMemo } from 'react';
import { TodoFilter } from './TodoFilter';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as todoService from '../api/todos';

export const Footer: React.FC = () => {
  const { todos, deleteTodo, setErrorMessage, SetUpdatingIds } =
    useContext(TodoContext);

  const completedIds: number[] = useMemo(
    () => todos.filter(({ completed }) => completed).map(({ id }) => id),
    [todos],
  );
  const activeTodosCount = useMemo(
    () =>
      todos.filter(({ completed }) => {
        return !completed;
      }).length,
    [todos],
  );
  const handleDeleteComplTodos = () => {
    setErrorMessage(Error.none);

    completedIds.forEach(id => {
      SetUpdatingIds(id);

      todoService
        .deleteTodo(id)
        .then(() => deleteTodo(id))
        .catch(() => setErrorMessage(Error.deleteTodo))
        .finally(() => SetUpdatingIds(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedIds.length}
        onClick={handleDeleteComplTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
