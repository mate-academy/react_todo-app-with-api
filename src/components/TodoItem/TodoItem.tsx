import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useState,
  useContext,
} from 'react';
import classNames from 'classnames';
import { TodoListContext } from '../../context/TodoListContext';
import { Todo } from '../../types/Todo';

/* eslint-disable jsx-a11y/no-autofocus */
type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onCompletedToggle: (id: number, isCompleted: boolean) => void
  onTitleChange: (id: number, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onCompletedToggle,
  onTitleChange,
}) => {
  const {
    deletedId,
    editedId,
    areAllEdited,
    areCompletedDel,
  } = useContext(TodoListContext);

  const { id, title, completed: isCompleted } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedValue, setEditedValue] = useState(title);

  const isLoading = id === 0
    || id === deletedId
    || id === editedId
    || areAllEdited
    || (areCompletedDel && isCompleted);

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedValue(event.target.value);
  };

  const handleEditSave = () => {
    setIsEdited(false);

    if (editedValue === title) {
      return;
    }

    if (editedValue === '') {
      handleDelete();

      return;
    }

    onTitleChange(id, editedValue);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleEditSave();
  };

  const handleEditCancel = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setEditedValue(title);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          readOnly={isCompleted}
          onChange={() => onCompletedToggle(id, isCompleted)}
        />
      </label>

      {!isEdited ? (
        <>
          <span className="todo__title" onDoubleClick={() => setIsEdited(true)}>
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedValue}
            onChange={handleEditChange}
            onBlur={handleEditSave}
            onKeyUp={handleEditCancel}
            autoFocus
          />
        </form>
      )}

      <div
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
