import cn from 'classnames';
import React, { useState } from 'react';
import { ErrorType } from '../../../types/ErrorType';
import { Todo } from '../../../types/Todo';
import { EditTodoTitleForm } from './EditTodoTitleForm';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadTodos: () => Promise<void>;
  onUpdateTodoStatus: (todoId: number, status: boolean) => Promise<void>;
  isProcessed: boolean;
  onChangeError: (errorType: ErrorType) => void;
  onChangeProcessingIds: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDeleteTodo,
  loadTodos,
  onUpdateTodoStatus,
  isProcessed,
  onChangeError,
  onChangeProcessingIds,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isDoubleClick, setIsDoubleClick] = useState(false);

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    onChangeProcessingIds(todoId);
    await onDeleteTodo(todoId);
    await loadTodos();
    onChangeProcessingIds(0);
  };

  const handleChangingTodoStatus = async (
    todoId: number,
    status: boolean,
  ): Promise<void> => {
    onChangeProcessingIds(todoId);
    await onUpdateTodoStatus(todoId, status);
    await loadTodos();
    onChangeProcessingIds(0);
  };

  const handleDoubleClick = (isRelevant: boolean): void => {
    setIsDoubleClick(isRelevant);
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleChangingTodoStatus(id, !completed)}
        />
      </label>

      {isDoubleClick
        ? (
          <EditTodoTitleForm
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            loadTodos={loadTodos}
            onChangeError={onChangeError}
            handleDoubleClick={handleDoubleClick}
            onChangeProcessingIds={onChangeProcessingIds}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(true)}
            >
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
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isProcessed },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
