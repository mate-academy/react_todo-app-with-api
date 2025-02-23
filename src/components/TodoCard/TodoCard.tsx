/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types';
import classNames from 'classnames';

import TodosContext from '../../contexts/Todos/TodosContext';

type Props = {
  todo: Todo;
  isPending?: boolean;
};

export const TodoCard = ({ todo, isPending = false }: Props) => {
  const { deleteTodo, updateTodo } = TodosContext.useContract();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const editRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = async () => {
    setIsUpdating(true);

    await deleteTodo(todo.id);

    setIsUpdating(false);
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    debugger;
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const title = (formData.get('title') as string).trim();

    if (todo.title === title) {
      setIsEditing(false);

      return;
    }

    setIsUpdating(true);

    let isEditSuccess = true;

    try {
      if (!title) {
        await deleteTodo(todo.id);
      } else {
        await updateTodo(todo.id, { title });
      }
    } catch {
      isEditSuccess = false;
    }

    if (isEditSuccess) {
      setIsEditing(false);
    }

    setIsUpdating(false);
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    try {
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch {}

    setIsUpdating(false);
  };

  const handeleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancelKeypress = (
    event: React.KeyboardEvent<HTMLFormElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handeleEditStart}
    >
      <label className="todo__status-label">
        <input
          onClick={handleToggleComplete}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form
          onKeyUp={handleEditCancelKeypress}
          onSubmit={handleEdit}
          onBlur={handleEdit}
        >
          <input
            ref={editRef}
            name="title"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}

          <button
            onClick={handleDeleteTodo}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
