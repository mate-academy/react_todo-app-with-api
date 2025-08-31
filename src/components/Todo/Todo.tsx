import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  handleDeleteTodo: (id: number) => void;
  deleteId: number[];
  handleToggleStatus: (id: number, completed: boolean) => void;
  editingTodoId: number | null;
  handleUpdateTitle: (id: number, title: string) => void;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  loadingIds: number[];
};

export const Todo: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  deleteId,
  handleToggleStatus,
  editingTodoId,
  handleUpdateTitle,
  setEditingTodoId,
  loadingIds,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId === todo.id) {
      titleInputRef.current?.focus();
    }
  }, [editingTodoId, todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleStatus(todo.id, todo.completed)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleUpdateTitle(todo.id, newTitle);
          }}
        >
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-edit"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => handleUpdateTitle(todo.id, newTitle)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setEditingTodoId(null);
              }
            }}
            ref={titleInputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            deleteId.includes(todo.id) || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
