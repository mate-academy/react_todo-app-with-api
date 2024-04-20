/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onSave: (todoId: number, newTitle: string, completed: boolean) => void;
  toggleTodoCompletion: (todoId: number) => void;
  deleteSingleTodo: (todoId: number) => void;
  loadingTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoCompletion,
  onSave,
  deleteSingleTodo,
  loadingTodoIds,
}) => {
  const { title, id, completed } = todo;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleSave = () => {
    if (newTitle.trim() === '') {
      deleteSingleTodo(todo.id);
    } else
      if (newTitle.trim() !== title.trim()) {
        onSave(id, newTitle, completed);
    }
    setEditing(false);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {editing ? (
        <input
          type="text"
          className="todo__title-field"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              setEditing(false);
              setNewTitle(title);
            }
          }}
          autoFocus
        />
      ) : (
        <div
          key={id}
          data-cy="Todo"
          className={classNames('todo', { completed: completed })}
          onDoubleClick={handleDoubleClick}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => toggleTodoCompletion(id)}
              autoFocus
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteSingleTodo(id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loadingTodoIds.includes(id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
