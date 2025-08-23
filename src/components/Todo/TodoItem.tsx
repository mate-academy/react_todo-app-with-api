import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../loader/Loader';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (postId: number) => Promise<void>;
  tempLoader?: boolean;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  tempLoader,
  updateTodo,
}) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const trimmedTitle = title.trim();

  const handleDelete = (id: number) => {
    setLoading(true);

    return deleteTodo(id).then(() => {
      setLoading(false);
    });
  };

  const handleUpdateStatus = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    setLoading(true);

    updateTodo(newTodo)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleUpdateTitle = (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      return handleDelete(todo.id).catch(() => {
        setLoading(false);
        setTitle(todo.title);
        setIsEditing(true);
      });
    }

    const newTodo = {
      ...todo,
      title: trimmedTitle,
    };

    setLoading(true);

    updateTodo(newTodo)
      .then(() => {
        setLoading(false);
        setIsEditing(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const cancelChanges = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          data-cy="TodoStatus"
          id={`todo-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={e => handleUpdateStatus(e)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            handleUpdateTitle(e);
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={event => handleUpdateTitle(event)}
            onKeyUp={event => {
              cancelChanges(event);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <Loader loading={loading || tempLoader} />
    </div>
  );
};
