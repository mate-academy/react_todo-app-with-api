import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  removeTodo: (id: number) => void
  isWaiting: number
  isDeletingCompleted: boolean
  onUpdateTodo:
  (id: number, todo: Pick<Todo, 'title'> | Pick<Todo, 'completed'>) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isWaiting,
  isDeletingCompleted,
  onUpdateTodo,
}) => {
  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      removeTodo(todo.id);
    } else {
      onUpdateTodo(todo.id, { title: todoTitle });
      setIsEditing(false);
    }
  };

  const handlerOnDelete = (id: number) => {
    removeTodo(id);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  const handleCompleted = () => {
    onUpdateTodo(todo.id, { completed: !completed });
  };

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current !== null) {
      inputField.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={handleCompleted}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              onBlur={handleCancel}
              ref={inputField}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handlerOnDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        {
          'is-active': (todo.id === 0
            || isWaiting === todo.id
            || (isDeletingCompleted && todo.completed)),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
