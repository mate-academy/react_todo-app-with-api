import React, {
  FormEvent,
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodosIds: number[];
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todoToUpdate: Todo) => Promise<void>;
  onChangeCompleted?: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodosIds,
  onDelete = () => {},
  onUpdate = () => {},
  onChangeCompleted = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    const preparedNewTitle = newTitle.trim();

    if (!preparedNewTitle) {
      onDelete(todo.id);

      return;
    }

    if (preparedNewTitle === todo.title) {
      setIsEditing(false);
      setNewTitle(todo.title);

      return;
    }

    const renemedTodo: Todo = {
      ...todo,
      title: preparedNewTitle,
    };

    onUpdate(renemedTodo)!
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setIsEditing(true);
        inputRef.current?.focus();
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleRename();
  };

  const handleEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChangeCompleted(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value.trimStart())}
            onBlur={handleRename}
            onKeyUp={handleEscape}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': !todo.id || loadingTodosIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
