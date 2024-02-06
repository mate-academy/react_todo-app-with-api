import React, { useContext } from 'react';
import { deleteTodos } from '../../api/todos';
import { TodoContext } from '../../context/TodoContext';
import { TodoFilter } from '../TodoFilter';
import { Error } from '../../types/Error';

interface Props {
  activeTodosCount: number;
  completedTodosIds: number[];
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosIds,
}) => {
  const {
    deleteTodo,
    handleError,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);

  const handleDeleteTodos = () => {
    handleError('');

    completedTodosIds.forEach(id => {
      handleUpdatingTodosIds(id);
      deleteTodos(id)
        .then(() => deleteTodo(id))
        .catch(() => {
          handleError(Error.Delete);
        })
        .finally(() => handleUpdatingTodosIds(null));
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
        onClick={handleDeleteTodos}
        disabled={!completedTodosIds.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
