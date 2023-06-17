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
  removesTodo,
  loadingTodos,
  onChangeTodo,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const formRef = useRef<HTMLInputElement | null>(null);
  const [queryTodo, setQueryTodo] = useState(title);
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

    setQueryTodo(updatedTitle);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditing]);

  const handleOnQuery = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryTodo(event.target.value);
  };

  const handleOnSubmit = () => {
    const updatedTitle = title.trim().replace(/\s+/g, ' ');
    const updatedQuery = queryTodo.trim().replace(/\s+/g, ' ');

    if (updatedTitle === updatedQuery) {
      setQueryTodo(updatedQuery);
      setIsEditing(false);

      return;
    }

    if (!updatedQuery) {
      removesTodo([id]);
      setQueryTodo(updatedTitle);
      setIsEditing(false);

      return;
    }

    onChangeTodo(id, 'title', updatedQuery);
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
          onClick={() => onChangeTodo(id, 'completed', [completed])}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleOnSubmit}
          id="changedForm"
        >
          <input
            type="text"
            className="todo__title-field"
            form="changedForm"
            value={queryTodo}
            onChange={handleOnQuery}
            onBlur={handleOnSubmit}
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
            onClick={() => removesTodo([id])}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
