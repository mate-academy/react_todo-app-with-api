import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onUpdateTodos?: (todo: Todo) => void,
  onDeleteTodo?: (id: number) => void,
  deletedIds?: number[],
  editedTodo?: Todo | null,
  togglingAll?: boolean,
  editing?: boolean,
  onEditing?: (todo: Todo | null) => void,
  onEditSubmit?: (
    id: number,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdateTodos = () => {},
  onDeleteTodo = () => {},
  deletedIds,
  editedTodo,
  togglingAll,
  editing,
  onEditing = () => {},
  onEditSubmit = () => {},
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTodo) {
      inputRef.current?.focus();
    }
  }, [editedTodo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => onEditing(todo)}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodos({ ...todo, completed: !completed })}
        />
      </label>

      {editing && id === editedTodo?.id
        ? (
          <form
            onSubmit={(event) => onEditSubmit(id, event)}
          >
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodo?.title}
              onChange={event => {
                onEditing({ ...todo, title: event.target.value });
              }}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  onEditing(null);
                }
              }}
              onBlur={() => onEditSubmit(id)}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': togglingAll
          || deletedIds?.includes(id)
          || id === 0
          || (id === editedTodo?.id && !editing),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
