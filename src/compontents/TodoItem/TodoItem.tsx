/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';
import { TodoEdit } from '../TodoEdit';

type TodoItemProps = {
  todo: Todo;
  loader?: boolean;
  onDelete: (id: number) => void;
  onUpdate?: (id: number, body: Partial<Todo>) => Promise<void>;
};

export function TodoItem({
  todo,
  loader = false,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEdit, setIsEdit] = useState(false);

  const handleChangeTitle = (titleText: string) => {
    if (titleText === '') {
      onDelete(todo.id);

      return;
    }

    if (onUpdate) {
      onUpdate(todo.id, { title: titleText }).then(() => setIsEdit(false));
    }
  };

  const handleOnUpdate = () => {
    if (onUpdate) {
      onUpdate(todo.id, { completed: !todo.completed });
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo is-active', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleOnUpdate}
        />
      </label>
      {isEdit ? (
        <TodoEdit
          title={todo.title}
          onChange={handleChangeTitle}
          onClose={() => setIsEdit(false)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {todo.title}
          </span>
          {/* Remove button appears only on hover */}
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
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
