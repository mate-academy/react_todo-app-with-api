import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { useState, useRef } from 'react';

type Props = {
  todo: Todo;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => void;
  updateTodo?: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem = ({
  todo,
  loadingIds,
  handleDeleteTodo,
  updateTodo,
}: Props) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const isSavingRef = useRef(false);

  const handleCheckboxChange = () => {
    updateTodo?.({ ...todo, completed: !todo.completed });
  };

  const handleCancelUpdate = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const saveChanges = () => {
    if (isSavingRef.current) {
      return;
    }

    const trimmedEditTitle = editTitle.trim();

    if (trimmedEditTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedEditTitle.length === 0) {
      handleDeleteTodo(todo.id);

      return;
    }

    isSavingRef.current = true;

    updateTodo?.({ ...todo, title: trimmedEditTitle })
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {})
      .finally(() => {
        isSavingRef.current = false;
      });
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveChanges();
  };

  const handleBlur = () => {
    saveChanges();
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            autoFocus
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleCancelUpdate}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}
      <Loader loadingIds={loadingIds} todoId={todo.id} />
    </div>
  );
};
