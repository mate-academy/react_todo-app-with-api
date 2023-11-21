import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
  todo: Todo;
  onTodoDelete?: (todoId: number) => void;
  onTodoRename?: (todoTitle: string) => void;
  isProcessing: number[];
  onTodoToggle: () => Promise<void>
};

export const Main: React.FC<Props> = ({
  todo,
  tempTodo,
  onTodoDelete = () => { },
  onTodoRename = () => { },
  onTodoToggle = () => { },
  isProcessing,
}) => {
  const { id, title, completed } = todo || tempTodo;
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isItemLoading, setIsItemLoading] = useState(todo.id === 0);

  const handleDubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsItemLoading(true);
    const titleOfTodo = todoTitle.trim();

    if (titleOfTodo === title) {
      setIsEditing(false);
      setIsItemLoading(false);

      return;
    }

    if (titleOfTodo) {
      await onTodoRename(titleOfTodo);
    } else {
      await onTodoDelete(id);
    }

    setIsEditing(false);
    setIsItemLoading(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleOnKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title.trim());
    }
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput.current) {
      titleInput.current.focus();
    }
  }, [isEditing]);

  const isLoaderActive = (isProcessing.includes(todo.id))
  || isItemLoading;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onTodoToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleChange}
            onKeyUp={handleOnKeyup}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDubleClick}
          >
            {(tempTodo && tempTodo.title) || title}

          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
