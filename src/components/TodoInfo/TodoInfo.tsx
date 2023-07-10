import {
  useState,
  FC,
  ChangeEvent,
  useEffect,
  useRef,
  memo,
} from 'react';
import cn from 'classnames';
import { TodoInfoProps } from './TodoInfoProps';

export const TodoInfo: FC<TodoInfoProps> = memo(({
  todo,
  removeTodos,
  loadingTodoIds,
  handleUpdate,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const formRef = useRef<HTMLInputElement | null>(null);
  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    const updatedTitle = title.trim().replace(/\s+/g, ' ');

    setTodoTitle(updatedTitle);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditing, title]);

  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = () => {
    const updatedTitle = title.trim().replace(/\s+/g, ' ');
    const updatedQuery = todoTitle.trim().replace(/\s+/g, ' ');

    if (updatedTitle === updatedQuery) {
      setTodoTitle(updatedQuery);
      setIsEditing(false);

      return;
    }

    if (!updatedQuery) {
      removeTodos([id]);
      setTodoTitle(updatedTitle);
      setIsEditing(false);

      return;
    }

    handleUpdate([id], todoTitle);
    setIsEditing(false);
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleUpdate([id])}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          id="changedForm"
        >
          <input
            type="text"
            className="todo__title-field"
            form="changedForm"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleQueryChange}
            onBlur={handleSubmit}
            ref={formRef}
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
            onClick={() => removeTodos([id])}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
