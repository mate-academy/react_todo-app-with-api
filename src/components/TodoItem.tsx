import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useAppContext } from '../context/Context';

interface Props {
  todoData: Todo;
  isLoading?: boolean;
}
export const TodoItem: React.FC<Props> = ({ todoData, isLoading = false }) => {
  const [loading, setIsLoading] = useState(isLoading);
  const { deleteTodo } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(todoData.title);

  const handleCompleted = () => {};

  const handleDelete = (id: number) => {
    setIsLoading(true);
    deleteTodo(id).finally(() => {
      setIsLoading(true);
    });
  };

  const handleDoubleClick = () => setEditMode(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleSave = () => {
    if (!title.trim()) {
      handleDelete(todoData.id);

      return;
    }

    // dispatch({
    //   type: 'updateTodo',
    //   payload: {
    //     ...todoData,
    //     title: title.trim(),
    //   },
    // });
    setEditMode(false);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditMode(false);
      setTitle(todoData.title);
    } else if (event.key === 'Enter') {
      handleTitleSave();
    }
  };

  useEffect(() => {
    if (editMode) {
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keyup', handleKeyUp);
      };
    }

    return;
  });

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todoData.completed })}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoData.completed}
          onChange={handleCompleted}
        />
      </label>

      {editMode ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={title}
            onBlur={handleTitleSave}
            onChange={e => handleTitleChange(e)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todoData.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todoData.id)}
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
