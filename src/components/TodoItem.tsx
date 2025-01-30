/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void | null>;
  loadingTodoId: number | null;
  toggleTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingTodoId,
  toggleTodo,
  updateTodoTitle,
}) => {
  const { id, completed, title } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      return setIsEditing(false);
    }

    const success = await (trimmedTitle
      ? updateTodoTitle?.(todo, trimmedTitle)
      : deleteTodo?.(id));

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    success && setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  const handleEditBlur = () => {
    handleSave();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })} key={id}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleEditBlur}
          onKeyDown={handleEditKeyDown}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
            disabled={loadingTodoId === todo.id}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
