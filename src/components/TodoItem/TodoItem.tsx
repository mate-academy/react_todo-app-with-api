import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo?: (todoId: number) => void,
  patchTodo?: (todoId: number, patch: object) => void,
  isProcesed?: boolean,
}

function creatPatchTodo(key: string, value: string | boolean) {
  return { [key]: value };
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => { },
  patchTodo = () => { },
  isProcesed,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeCompletedTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    patchTodo(todo.id, creatPatchTodo('completed', event.target.checked));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDeleteClick = () => {
    onDeleteTodo(todo.id);
  };

  const handleEditNewText = (): void => {
    setIsEdited(true);
  };

  useEffect(() => {
    if (isEdited) {
      inputRef.current?.focus();
    }
  }, [isEdited]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title === todo.title) {
      setIsEdited(false);

      return;
    }

    if (!title.trim()) {
      setIsEdited(false);

      onDeleteTodo(todo.id);

      return;
    }

    patchTodo(todo.id, creatPatchTodo('title', title));
    setIsEdited(false);
  };

  const handleCancelEditing = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEdited(false);
    }
  };

  const handleBlur = () => {
    setIsEdited(false);
    setTitle(todo.title);
  };

  return (
    <div
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
          onChange={handleChangeCompletedTodo}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            value={title}
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            onChange={handleInputChange}
            onKeyUp={handleCancelEditing}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEditNewText}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': isProcesed },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
