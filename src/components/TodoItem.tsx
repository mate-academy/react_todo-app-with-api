import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleTodoDelete: (id: number) => Promise<void>;
  processings: Set<number>;
  handleTodoUpdate: (todo: Todo) => Promise<void>;
  handleTodoToggle: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleTodoDelete,
  processings,
  handleTodoUpdate,
  handleTodoToggle,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editValue, setEditvalue] = useState('');
  const editedInputField = useRef<HTMLInputElement>(null);

  const isProcessed = processings.has(todo.id);
  const titleEdit = () => {
    const trimmedValue = editValue.trim();

    if (trimmedValue === todo.title.trim()) {
      setIsEdited(false);

      return;
    }

    if (isProcessed) {
      return;
    }

    if (editValue.trim() === '') {
      handleTodoDelete(todo.id)
        .then(() => setIsEdited(false))
        .catch(() => setIsEdited(true));
    } else {
      handleTodoUpdate({
        id: todo.id,
        title: editValue.trim(),
        userId: todo.userId,
        completed: todo.completed,
      })
        .then(() => setIsEdited(false))
        .catch(() => setIsEdited(true));
    }
  };

  const handleEscapeKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditvalue(todo.title);
      setIsEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleTodoToggle(todo);
          }}
          checked={todo.completed}
        />
      </label>

      {!isEdited ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEdited(true);
              setEditvalue(todo.title);
              setTimeout(() => editedInputField.current?.focus(), 0);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleTodoDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            titleEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editedInputField}
            value={editValue}
            onChange={event => setEditvalue(event.target.value)}
            onBlur={titleEdit}
            onKeyUp={handleEscapeKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
