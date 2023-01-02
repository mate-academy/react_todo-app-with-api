import classNames from 'classnames';
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onDelete: (todoId: number) => void,
  isLoading: boolean,
  onChangeStatus: (changeTodo: Todo) => void,
  onEditTitle: (id: number, newTitle: string) => void,
};

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  onDelete,
  isLoading,
  onChangeStatus,
  onEditTitle,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isChanging, setIsChanging] = useState(false);

  const newTodoTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoTitle.current) {
      newTodoTitle.current.focus();
    }
  });

  const handleUpdateForm = useCallback(
    async () => {
      setIsChanging(true);

      await onEditTitle(id, newTitle);

      setIsChanging(false);
      setIsEditing(false);
    }, [newTitle],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => onChangeStatus(todo)}
        />
      </label>

      {isEditing
        ? (
          <>
            <form
              onSubmit={event => {
                event.preventDefault();
                handleUpdateForm();
              }}
            >
              <input
                data-cy="NewTodoField"
                type="text"
                className="todo__title-field"
                value={newTitle}
                ref={newTodoTitle}
                onChange={event => setNewTitle(event.target.value)}
                onBlur={handleUpdateForm}
                onKeyDown={handleKeyDown}
              />
            </form>
          </>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
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

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading || isChanging,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
