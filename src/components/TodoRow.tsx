/* eslint-disable quote-props */
import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  toggleTodo: (todo: Todo) => void,
  onRenameTodo: (todoId: number, title: string) => void,
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoRow: React.FC<Props> = ({
  todo,
  toggleTodo,
  onRenameTodo,
  onDeleteTodo,
  deletingIds,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setTitle(todo.title);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title) {
      onRenameTodo(todo.id, title);
    } else {
      onDeleteTodo(todo.id);
    }

    setEditing(false);
  };

  return (
    <div
      className={cn('todo', { 'completed': todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => toggleTodo(todo)}
          checked
        />
      </label>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onKeyUp={handleKeyUp}
            onBlur={handleSubmit}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setEditing(true);
              setTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <div className={cn(
            'modal overlay',
            { 'is-active': deletingIds.includes(todo.id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
