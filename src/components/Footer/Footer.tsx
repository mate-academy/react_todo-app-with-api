import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodos } from '../../api/todos';
import { Error } from '../../types/Error';
import { TodoFilter } from '../TodoFilter';

type Props = {
  activeTodosAmount: number;
  completedTodosIds: number[];
};

export const Footer: React.FC<Props> = ({
  activeTodosAmount,
  completedTodosIds,
}) => {
  const {
    deleteTodo,
    handleUpdatingTodosIds,
    handleError,
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
        {`${activeTodosAmount} items left`}
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
