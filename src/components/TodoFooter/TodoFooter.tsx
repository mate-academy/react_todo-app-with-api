import React from 'react';
import { useCompletedTodos } from '../../helpers/useComplitedTodos';
import { getActiveTodos } from '../../helpers/getActiveTodos';
import { TodoFilter } from '../TodoFilter';
import { apiClient } from '../../api/todos';
import { useTodosContext } from '../store';
import { ErrorOption } from '../../enum/ErrorOption';

type Props = {
  handlerErrors: (errMessage: ErrorOption) => void,
};

export const TodoFooter: React.FC<Props> = ({ handlerErrors }) => {
  const {
    todos,
    removeTodo,
    addDeletingTodoIds,
  } = useTodosContext();

  const completedTodosLength = useCompletedTodos().length;
  const uncompletedTodosLength = getActiveTodos(todos).length;
  const completedTodosIds = useCompletedTodos().map(todo => todo.id);

  const handlerDeleteCompletedTodos = () => {
    addDeletingTodoIds(completedTodosIds);

    apiClient.deleteComplitedTodos(completedTodosIds)
      .then(() => {
        completedTodosIds.forEach(todoId => {
          removeTodo(todoId);
        });
      })
      .catch(() => {
        handlerErrors(ErrorOption.DeleteTodoError);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosLength} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosLength}
        onClick={handlerDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
