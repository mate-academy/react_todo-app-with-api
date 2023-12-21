import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  onDeleteTodo?: (id: number) => void;
  isProcessing: Todo | null;
  onToggleCompleted: (todo: Todo) => void;
  isEditing: Todo | null;
  onEditTodo: (todo: Todo | null) => void;
  onSaveTodo: (titleUpdated: string, todo: Todo) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  isProcessing,
  onToggleCompleted,
  isEditing,
  onEditTodo,
  onSaveTodo,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing, onSaveTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSaveTodo(editedTitle, todo);
  };

  const handleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEditTodo(null);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onToggleCompleted(todo)}
        />
      </label>

      {isEditing === todo ? (
        <form onSubmit={(event) => handleSubmit(event)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={titleField}
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={() => onSaveTodo(editedTitle, todo)}
            onKeyUp={(key) => handleKeyup(key)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEditTodo(todo)}
          onBlur={() => onEditTodo(null)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo && onDeleteTodo(todo.id)}
      >
        ×
      </button>

      {isProcessing && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isProcessing && isProcessing.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
