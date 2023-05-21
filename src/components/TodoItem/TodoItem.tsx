import {
  FC,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  todoId: number | null;
  completedTodosId: number[];
  onDelete: (id: number) => void;
  setTodoId: (id: number | null) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onChangeTitle: (id: number, title: string) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  todoId,
  completedTodosId,
  onDelete,
  setTodoId,
  onChangeStatus,
  onChangeTitle,
}) => {
  const { id, title, completed } = todo;
  const shouldShowIsActive = todoId === id || completedTodosId.includes(id);
  const [newTitle, setNewTitle] = useState<string>(title);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const handleDelete = useCallback(() => {
    setTodoId(id);
    onDelete(id);
  }, []);

  const handleChangeStatus = useCallback(() => {
    setTodoId(id);
    onChangeStatus(id, !completed);
  }, [completed]);

  const handleChangeTitle = useCallback((
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!newTitle) {
      handleDelete();

      return;
    }

    setTodoId(id);
    onChangeTitle(id, newTitle);
    setIsEdited(false);
  }, [newTitle, id]);

  const handleBlurInput = (event: FocusEvent<HTMLInputElement, Element>) => {
    event.preventDefault();
    setNewTitle(event.target.value);

    if (!newTitle) {
      handleDelete();

      return;
    }

    setTodoId(id);
    onChangeTitle(id, newTitle);
    setIsEdited(false);
  };

  const handlePressEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(newTitle);
      setIsEdited(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handlePressEsc);

    return () => {
      document.removeEventListener('keydown', handlePressEsc);
    };
  }, [newTitle]);

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
          onChange={handleChangeStatus}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleChangeTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleBlurInput}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
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
      )}

      <div className={cn('modal overlay', { 'is-active': shouldShowIsActive })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
