/* eslint-disable jsx-a11y/label-has-associated-control */
import { deleteTodo, ErrorMessagesNotification } from '../api/todos';
import classNames from 'classnames';
import { Todo } from './TodoList';
import { useState } from 'react';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: (error: ErrorMessagesNotification | null) => void;
};

const TodoItem = ({ todo, setTodos, inputRef, setError }: Props) => {
  const [isDeleting, setDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleDelete = async () => {
    setDelete(true);
    try {
      await deleteTodo(todo.id as number);

      setTodos(current =>
        current.filter(deletedTodo => {
          return deletedTodo.id !== todo.id;
        }),
      );
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      setError(ErrorMessagesNotification.DELETE);
      setDelete(false);
    }
  };

  const toggleTodo = async () => {
    if (typeof todo.id !== 'number') {
      return;
    }

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
    );

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(ErrorMessagesNotification.UPDATE);

      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: false } : t)),
      );
    }
  };

  const handleEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDelete();

      return;
    }

    if (typeof todo.id !== 'number') {
      return;
    }

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
    );

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      setIsEditing(false);
    } catch {
      setError(ErrorMessagesNotification.UPDATE);

      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: false } : t)),
      );
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      // eslint-disable-next-line react/jsx-no-comment-textnodes
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>
      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            setEditedTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleEdit}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedTitle(todo.title);
              }
            }}
            autoFocus
          />
        </form>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.loading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
