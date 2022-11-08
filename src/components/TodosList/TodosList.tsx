import cn from 'classnames';
import React, {
// useCallback,
// useContext,
// useEffect,
// useState,
// useRef,
// useState,
// useMemo,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadTodos: () => Promise<void>;
  changeTodoStatus: (todoId: number, status: boolean) => Promise<void>;
  processingId: number[];
};

export const TodosList: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadTodos,
  changeTodoStatus,
  processingId,
}) => {
  const handleDeleteTodo = async (todoId: number) => {
    await onDeleteTodo(todoId);
    loadTodos();
  };

  const handleChangingTodoStatus = async (todoId: number, status: boolean) => {
    await changeTodoStatus(todoId, status);
    loadTodos();
  };

  return (
    <>
      {todos.map(({ title, completed, id }) => (
        <div
          data-cy="Todo"
          className={cn(
            'todo',
            { completed },
          )}
          key={id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => handleChangingTodoStatus(id, !completed)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn(
              'modal overlay',
              { 'is-active': processingId.includes(id) },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
});
