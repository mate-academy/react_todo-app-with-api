import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
  deleteTodo: (id: number) => void
  updateTodo: (updatedTodo: Todo) => void
  loadingById: number[]
  setLoadingById: React.Dispatch<React.SetStateAction<number[]>>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo = () => {},
  updateTodo,
  loadingById,
  setLoadingById,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCheck = event.target.checked;
    const update: Todo = {
      ...todo,
      completed: isCheck,
    };

    setLoadingById([...loadingById, todo.id]);

    updateTodo(update);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.target.value.trim() === '') {
        deleteTodo(todo.id);

        return;
      }

      const update: Todo = {
        ...todo,
        title: newTitle,
      };

      updateTodo(update);
      setIsEdit(false);
    } else if (event.key === 'Escape') {
      setIsEdit(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckedChange}
        />
      </label>

      {isEdit ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={newTitle}
            onChange={handleEditChange}
            onBlur={() => setIsEdit(false)}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': loadingById.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
