/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteSingleTodo: (todoId: number) => void;
  onSave: (todoId: number, newTitle: string) => void;
};

export const TempTodo: React.FC<Props> = ({
  todo,
  deleteSingleTodo,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleSave = () => {
    onSave(todo.id, newTitle);
    setEditing(false);
  };

  const { title, id, completed } = todo;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      <div
        onDoubleClick={handleDoubleClick}
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
      >
        <label className="todo__status-label">
          {editing && (
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              value={newTitle}
              checked={completed}
              // onChange={() => {}}
              onChange={handleChange}
              onBlur={handleSave}
            />
          )}
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
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
