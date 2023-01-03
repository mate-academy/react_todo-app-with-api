import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void,
  isLoading: boolean,
  onRename: (todo: Todo, newTitle: string) => Promise<void>,
  onChangeStatus: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onRename,
  onChangeStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  });

  const handleSuccessfulEdit = useCallback(() => {
    onRename(todo, newTitle);
    setIsEditing(false);
  }, [newTitle]);

  const handlePressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    }, [],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChangeStatus(todo)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleSuccessfulEdit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={newTodoTitle}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleSuccessfulEdit}
              onKeyDown={handlePressEsc}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <Loader onLoad={isLoading} />
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
