import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType,
  onTodoRemove: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onEditTodo: (id: number) => void;
  editedTodoId: number | null;
  editedTodoText: string;
  setEditedTodoText: (newTitle: string) => void;
  onEditedTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setEditedTodoId: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: number[];
}

export const Todo: React.FC<TodoProps> = React.memo(({
  todo,
  onTodoRemove,
  onToggleTodo,
  onEditTodo,
  editedTodoId,
  editedTodoText,
  setEditedTodoText,
  onEditedTodoSubmit,
  setEditedTodoId,
  inputRef,
  isLoading,
}) => {
  const { completed, id, title } = todo;
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
    }
  };

  return (
    !isLoading.includes(id)
      ? (
        <div
          className={cn('todo', {
            completed,
          })}
          key={id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onChange={() => onToggleTodo(id)}
            />
          </label>
          {editedTodoId !== id
            ? (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => onEditTodo(id)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onTodoRemove(id)}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <form
                  onSubmit={onEditedTodoSubmit}
                  onBlur={onEditedTodoSubmit}
                >
                  <input
                    onKeyUp={handleKeyUp}
                    ref={inputRef}
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editedTodoText}
                    onChange={(e) => setEditedTodoText(e.target.value)}
                  />
                </form>
                <div className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            )}
        </div>
      )
      : (
        <div
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>
          <span className="todo__title">{todo.title}</span>
          <button type="button" className="todo__remove">×</button>
          <div className={cn('modal overlay',
            { 'is-active': isLoading.includes(id) })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )
  );
});
