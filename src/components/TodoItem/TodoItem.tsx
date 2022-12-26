import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
  onUpdate: (todo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onRename,
  onUpdate,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  });

  const handleEdit = useCallback(() => {
    onRename(todo, newTitle);
    setIsEditing(false);
  }, [newTitle]);

  const handleEscape = useCallback(
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
      className={classNames('todo',
        {
          completed: todo.completed,
        })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleEdit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Todo without title will be deleted"
              ref={newTodoTitle}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleEscape}
            />
          </form>
        )
        : (
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

            <Loader isLoading={isLoading} />
          </>
        )}
    </div>
  );
};
