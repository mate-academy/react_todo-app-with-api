import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos:Todo[],
  todo: Todo,
  handleDeleteTodo: (id: number) => void,
  handleUpdateStatus: (id: number) => void,
  handleUpdateTitle: (id: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleUpdateStatus,
  handleUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement> |
  React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!todo.title.trim()) {
      handleDeleteTodo(todo.id);

      return;
    }

    handleUpdateTitle(todo.id, title);
    setIsEditing(false);
  };

  return (
    <ul>
      <li>
        <section className="todoapp__main">
          <div
            key={todo.id}
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  handleUpdateStatus(todo.id);
                }}
              />
            </label>
            {isEditing ? (
              <form onSubmit={handleTitleSubmit}>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </form>
            ) : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
                <div className="modal overlay">
                  <div
                    className="modal-background has-background-white-ter"
                  />
                  <div
                    className="loader"
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </li>
    </ul>
  );
};
