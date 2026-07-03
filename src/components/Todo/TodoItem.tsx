import React, { useState } from 'react';
import { Todo, TodoUpdate } from '../../types/Todo';
import cn from 'classnames';
import { TodoEdit, TodoEditFormData } from './TodoEdit';

type Props = {
  todo: Todo;
  onDelete: (id: Todo['id']) => void;
  onChange: (id: Todo['id'], values: TodoUpdate) => Promise<void>;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete,
  onChange,
}) => {
  const [edit, setEdit] = useState(false);

  function handleChangeCompleted() {
    onChange(todo.id, { completed: !todo.completed }).then(() => {});
  }

  async function handleChangeTitle({ title }: TodoEditFormData) {
    if (title === '') {
      onDelete(todo.id);

      return;
    }

    onChange(todo.id, { title })
      .then(() => {
        setEdit(false);
      })
      .catch(() => {});
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompleted}
        />
      </label>
      {edit ? (
        <TodoEdit
          title={todo.title}
          onSubmit={handleChangeTitle}
          onCansel={() => setEdit(false)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEdit(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
