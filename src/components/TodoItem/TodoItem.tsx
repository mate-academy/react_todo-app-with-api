import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../Api/todos';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  changeStatus: (id: number, property: Partial<Todo>) => void,
}

export const TodoItem: FC<Props> = ({ todo, onDelete, changeStatus }) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const [todoTitle, setTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      onDelete(id);
    } else {
      updateTodo(id, { title: todoTitle });
    }

    setIsEditing(false);
  };

  const inputField = useRef<HTMLInputElement>(null);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => changeStatus(id,
            { completed: !completed })}
        />
      </label>

      { isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title todo__title-field"
              type="text"
              value={todoTitle}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={inputField}
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todoTitle}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
