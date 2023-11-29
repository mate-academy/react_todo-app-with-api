import {
  FC,
  useContext,
  useState,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  memo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { LoadContext } from '../Context/LoadContext';

interface Props {
  todo: Todo,
  onDelete: (id: number) => void,
  onChangeStatus: (id: number, property: Partial<Todo>) => void
}

export const TodoItem: FC<Props> = memo((props) => {
  const {
    todo,
    onDelete,
    onChangeStatus,
  } = props;

  const {
    id,
    title,
    completed,
  } = todo;

  const loadingTodos = useContext(LoadContext);
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const input = useRef<HTMLInputElement | null>(null);

  const updateTodoTitle = () => {
    if (changedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!changedTitle.trim()) {
      onDelete(id);
    }

    onChangeStatus(id, { title: changedTitle });
    setIsEditing(false);
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodoTitle();
  };

  const cancelEditing = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setChangedTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    updateTodoTitle();
  }, []);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onChangeStatus(id, { completed: !completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={input}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={handleChangeTitle}
            onBlur={handleBlur}
            onKeyUp={cancelEditing}
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
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn(
        'modal overlay',
        {
          'is-active': loadingTodos.includes(id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
