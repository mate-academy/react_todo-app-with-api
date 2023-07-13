import {
  useState,
  FC,
  ChangeEvent,
  useEffect,
  useRef,
  memo,
  KeyboardEvent,
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

    const updatedTitle = title.trim().replace(/\s+/g, ' ');

    setTodoTitle(updatedTitle);
  }, [title, isEditing]);

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

  const handleTodoStatus = () => handleUpdate([id]);
  const handleEditTitle = () => setIsEditing(true);
  const handleRemoveTodo = () => removeTodos([id]);
  const handleAbolitionEditTitle = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    const ESCAPE = 'Escape';

    if (event.key === ESCAPE) {
      setIsEditing(false);
    }
  };

  const isIdInLoadingTodoIds = loadingTodoIds.includes(id);

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
          onClick={handleTodoStatus}
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
            onKeyUp={handleAbolitionEditTitle}
            onBlur={handleSubmit}
            ref={formRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEditTitle}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isIdInLoadingTodoIds,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
