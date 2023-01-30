import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  isNewTodoLoading?: boolean,
  toggleTodoStatus: (todoId: number, checked: boolean) => void,
  shouldTodoUpdate?: boolean,
  updateTodoTitle: (
    todoId: number,
    newTitle: string,
  ) => void,
}

export const TodoInfo:React.FC<Props> = memo(({
  newTodoField,
  todo,
  deleteTodo,
  isNewTodoLoading,
  toggleTodoStatus,
  shouldTodoUpdate,
  updateTodoTitle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleEditing]);

  const handleDeleteTodo = async () => {
    setIsLoading(true);
    await deleteTodo(todo.id);
    setIsLoading(false);
  };

  const handleUpdateTodo = async () => {
    setIsTitleEditing(false);
    if (!title) {
      handleDeleteTodo();

      return;
    }

    if (title !== todo.title) {
      setIsLoading(true);
      await updateTodoTitle(todo.id, title);
      setIsLoading(false);
    }
  };

  const handleCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Esc' && isTitleEditing) {
      setIsTitleEditing(false);
    }
  };

  const isProcessing = isLoading || isNewTodoLoading || shouldTodoUpdate;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isTitleEditing
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleUpdateTodo();
            }}
          >
            <input
              ref={newTodoField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => handleUpdateTodo()}
              onKeyDown={(event) => handleCancelEditing(event)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
