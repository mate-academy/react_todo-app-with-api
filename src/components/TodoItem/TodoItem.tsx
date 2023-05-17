import {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  todoId: number | null;
  isDisabledInput: boolean;
  completedTodosId: number[];
  onDelete: (id: number) => void;
  setTodoId: (id: number | null) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onChangeTitle: (id: number, title: string) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  todoId,
  isDisabledInput,
  completedTodosId,
  onDelete,
  setTodoId,
  onChangeStatus,
  onChangeTitle,
}) => {
  const { id, title, completed } = todo;
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (selectedTodoId: number) => {
    setTodoId(selectedTodoId);
    onDelete(selectedTodoId);
  };

  const handleChangeStatus = (selectedTodoId: number) => {
    setTodoId(selectedTodoId);
    onChangeStatus(selectedTodoId, !completed);
  };

  const handleDoubleClick = (editedId: number) => {
    setEditedTodoId(editedId);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editedTitle) {
      handleDelete(id);

      return;
    }

    setIsEditing(true);
    onChangeTitle(id, editedTitle);
    setEditedTodoId(null);
    setIsEditing(false);
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
    setEditedTodoId(null);
  };

  const handlePressEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditedTodoId(null);
    }
  };

  const shoulLoaderHide = id === todoId
  || completedTodosId.includes(id)
  || isEditing;

  useEffect(() => {
    document.addEventListener('keydown', handlePressEsc);

    return () => {
      document.removeEventListener('keydown', handlePressEsc);
    };
  }, [editedTodoId]);

  return (
    <div
      key={id}
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeStatus(id)}
          disabled={isDisabledInput}
        />
      </label>

      {editedTodoId !== id ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
          />
        </form>
      )}

      <div className={cn('modal overlay', {
        'is-active': shoulLoaderHide,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
