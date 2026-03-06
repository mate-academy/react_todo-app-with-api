import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { UpdateTodoData } from '../../types/UpdateTodoData';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  isLoader?: boolean;
  updateTodo?: (id: number, data: UpdateTodoData) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isLoader = false,
  updateTodo = async () => {},
}) => {
  const todoId = `todo-status-${todo.id}`;
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (tempTitle === todo.title) {
      setIsTodoEditing(false);
    } else {
      if (tempTitle) {
        updateTodo(todo.id, { title: tempTitle.trim() }).then(() => {
          setIsTodoEditing(false);
        });
      } else {
        onDelete(todo.id);
      }
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label" htmlFor={todoId}>
        <span className="is-hidden">Checkbox</span>
        <input
          id={todoId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            updateTodo(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {!isTodoEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
          >
            {todo.title}
          </span>

          <button
            disabled={isLoader}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            autoFocus={true}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setIsTodoEditing(false);
                setTempTitle(todo.title);
              }
            }}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoader && `is-active`}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
