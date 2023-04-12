import {
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  loadingTodosId: number[],
  onUpdate: (id: number, data: Partial<Todo>) => void;
};

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    loadingTodosId,
    onUpdate,
  } = props;

  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isTodoIdLoading = loadingTodosId.includes(id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditingCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleTitleEditinig = () => {
    if (editedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle.trim()) {
      onDelete(id);
    }

    onUpdate(id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleSubmitEditing = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTitleEditinig();
  };

  const handleTodoCheck = () => {
    onUpdate(id, {
      completed: !completed,
    });
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoCheck}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitEditing}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={inputRef}
            onChange={(event) => setEditedTitle(event.target.value)}
            onKeyUp={(event) => event.key === 'Escape' && handleEditingCancel()}
            onBlur={handleTitleEditinig}
          />
        </form>
      ) : (
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
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isTodoIdLoading },
        )}
      >

        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
