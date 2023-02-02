import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  isNewTodoLoading?: boolean,
  toggleTodoStatus: (todoId: number, checked: boolean) => void,
  isUpdating?: boolean,
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
  isUpdating,
  updateTodoTitle,
}) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleEditing]);

  const handleUpdateTodo = async () => {
    setIsTitleEditing(false);
    if (!editedTitle) {
      deleteTodo(todo.id);

      return;
    }

    if (editedTitle !== todo.title) {
      updateTodoTitle(todo.id, editedTitle);
    }
  };

  const handleCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Esc' && isTitleEditing) {
      setIsTitleEditing(false);
    }
  };

  const isLoading = isNewTodoLoading || isUpdating;

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
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleUpdateTodo}
              onKeyDown={handleCancelEditing}
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
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
