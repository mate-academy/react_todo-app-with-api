import React, { useState } from 'react';
import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types';
import { ErrorType } from '../../types';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  processingId: number | null;
  setProcessingId: React.Dispatch<React.SetStateAction<number | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  processingId,
  setProcessingId,
  inputRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDelete = () => {
    setProcessingId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('delete');
        setIsEditing(true);
      })
      .finally(() => setProcessingId(null));
  };

  const handleSubmit = () => {
    const trimmed = title.trim();

    // n mudou
    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    // vazio => deletar
    if (!trimmed) {
      handleDelete();

      return;
    }

    // mudou => atualizar
    setProcessingId(todo.id);

    patchTodo(todo.id, { title: trimmed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );

        setIsEditing(false);
      })
      .catch(() => {
        setError('update');
      })
      .finally(() => {
        setProcessingId(null);
      });
  };

  const handlekeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Mark ${todo.title} as completed`}
          onChange={() => {
            setProcessingId(todo.id);

            patchTodo(todo.id, { completed: !todo.completed })
              .then(updatedTodo => {
                setTodos(prev =>
                  prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
                );
              })
              .catch(() => setError('update'))
              .finally(() => setProcessingId(null));
          }}
          readOnly
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyUp={handlekeyUp}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            setTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            setProcessingId(todo.id);

            deleteTodo(todo.id)
              .then(() => {
                setTodos(prev => prev.filter(t => t.id !== todo.id));
                inputRef.current?.focus();
              })
              .catch(() => {
                setError('delete');
              })
              .finally(() => setProcessingId(null));
          }}
        >
          x
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          processingId === todo.id ? 'is-active' : 'hidden'
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
