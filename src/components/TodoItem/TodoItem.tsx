import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeCompletedTodos: (id: number[]) => void,
  removeTodoTitle: (id: number) => Promise<void | null>,
  deletedTodo?: number[],
  updateTodoStatus: (t: Todo) => void,
  changedTodo?: number[],
  updateTitleTodo: (t: Todo) => Promise<void | Todo>
};
export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeCompletedTodos,
  removeTodoTitle,
  deletedTodo,
  updateTodoStatus,
  changedTodo,
  updateTitleTodo,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedToto, setEditedTodo] = useState(todo.title);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodo(event.target.value);
  };

  const handleCancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTodo(todo.title);
      setIsEditable(false);
    }
  };

  const fieldTitleTodo = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditable) {
      fieldTitleTodo.current?.focus();
    }
  }, [isEditable]);

  const saveChanges = () => {
    if (editedToto.trim() && editedToto.trim() !== todo.title) {
      updateTitleTodo({ ...todo, title: editedToto.trim() })
        .then(() => setIsEditable(false))
        .catch(() => fieldTitleTodo.current?.focus());
    } else if (!editedToto.trim()) {
      removeTodoTitle(todo.id)
        .then(() => setIsEditable(false))
        .catch(() => fieldTitleTodo.current?.focus());
    }

    if (editedToto.trim() === todo.title) {
      setIsEditable(false);
    }
  };

  const handleChangeTitleTodo = (event: React.FormEvent) => {
    event.preventDefault();
    saveChanges();
  };

  return (
    <div
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
          onClick={() => updateTodoStatus(
            { ...todo, completed: !todo.completed },
          )}
        />
      </label>
      {!isEditable
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditable(!isEditable)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                removeCompletedTodos([todo.id]);
              }}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleChangeTitleTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={fieldTitleTodo}
              value={editedToto}
              onChange={handleChangeTitle}
              onBlur={saveChanges}
              onKeyUp={handleCancelEditing}
            />
          </form>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deletedTodo?.includes(todo.id)
            || changedTodo?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
