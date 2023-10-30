import React, {
  useState, useEffect, useRef, FormEventHandler,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { editTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type TodoItemProps = {
  todo: Todo;
  handleDeleteTodo: (todo: Todo, callback: () => void) => void;
  handleCompleteTodo: (todo: Todo, callback: () => void) => void;
  handleError: (error: Errors) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  handleCompleteTodo,
  handleError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEdited(true);
    setEditedTitle(todo.title);
  };

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEdited(false);
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (editedTitle === todo.title) {
      setIsLoading(false);
      setIsEdited(false);

      return;
    }

    if (editedTitle === '') {
      setIsLoading(true);
      handleDeleteTodo(todo, () => setIsLoading(false));

      return;
    }

    editTodo(todo.id, {
      title: editedTitle.trim(),
    })
      .then(() => {
        const updatedTodo = { ...todo, title: editedTitle.trim() };

        setIsEdited(false);
        handleCompleteTodo(updatedTodo, () => setIsLoading(false));
      })
      .catch(() => {
        handleError(Errors.updating);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isEdited) {
      editInputRef.current?.focus();
    }
  }, [isEdited]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            setIsLoading(true);
            handleCompleteTodo(todo, () => setIsLoading(false));
          }}
        />
      </label>
      {!isEdited
      && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsLoading(true);
              handleDeleteTodo(todo, () => setIsLoading(false));
            }}
          >
            ×
          </button>
        </>
      )}
      {isEdited && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            onBlur={handleSubmit}
            ref={editInputRef}
            className="todo__title-field"
            value={editedTitle}
            type="text"
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyUp={handleEscape}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
