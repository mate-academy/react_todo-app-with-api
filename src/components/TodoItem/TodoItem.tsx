import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle
import { FetchContext } from '../../App';

interface Props {
  todo: Todo;
  isPerentLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isPerentLoading,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [checked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteTodos, updateTodoComplete } = useContext(FetchContext);
  const { title, completed, id } = todo;

  const handleCompleteChange = () => {
    setIsLoading(true);
    updateTodoComplete(id, { completed: !checked }).finally(() => {
      setIsLoading(false);
    });
    setChecked(!checked);
  };

  useEffect(() => {
    setChecked(todo.completed);
  }, [todo.completed]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoDelete = () => {
    setIsLoading(true);
    deleteTodos(id).finally(() => setIsLoading(false));
  };

  const handleUpdateTitle = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (title === editedTitle) {
      setIsEditing(false);

      return;
    }

    if (editedTitle.trim() === '') {
      handleTodoDelete();
    }

    setIsLoading(true);
    updateTodoComplete(id, { title: editedTitle }).finally(() => {
      setIsLoading(false);
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    handleUpdateTitle();
  };

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={checked}
          onChange={handleCompleteChange}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleUpdateTitle}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleInputTitle}
            onBlur={handleCancelEdit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDelete}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isPerentLoading || isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
