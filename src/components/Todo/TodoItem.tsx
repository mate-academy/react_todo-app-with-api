import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove?: (id: number) => void;
  isProcessed: boolean;
  onEdit?: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onRemove = () => {},
  isProcessed,
  onEdit = () => {},
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const editField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editField.current) {
      editField.current.focus();
    }
  }, [isEditing]);

  const changed = () => {
    setIsEditing(false);

    if (newTitle === todo.title) {
      return;
    }

    if (newTitle) {
      onEdit({ ...todo, title: newTitle });
    } else {
      onRemove(todo.id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
      onDoubleClick={() => {
        setIsEditing(true);
        if (editField.current) {
          editField.current.focus();
        }
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          defaultChecked={todo.completed}
          className="todo__status"
          onChange={() => onEdit({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            changed();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={editField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={changed}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  changed();
                }
              }}
            />
          </form>
        )
        : (
          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
        )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onRemove(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={`modal overlay ${isProcessed && 'is-active'}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
