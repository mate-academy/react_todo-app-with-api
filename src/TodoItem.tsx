/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  editInputRef?: React.RefObject<HTMLInputElement>;
  editId?: number | null;
  editTitle?: string;
  todo: Todo;
  onDelete?: () => void;
  loading?: boolean;
  setEditId?: (arg0: number) => void;
  handleSubmitEdit?: (arg0: React.FormEvent<HTMLFormElement>) => void;
  handleCancelEdit?: () => void;
  setEditTitle?: (arg0: string) => void;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  editInputRef,
  editId,
  editTitle,
  handleSubmitEdit = () => {},
  handleCancelEdit = () => {},
  onDelete = () => {},
  loading = false,
  setEditId = () => {},
  setEditTitle = () => {},
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {editId !== todo.id && (
        <>
          <label className="todo__status-label">
            <input
              ref={editInputRef}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', { 'is-active': loading })}
          >
            <div
              className="
            modal-background has-background-white-ter
          "
            />
            <div className="loader" />
          </div>
        </>
      )}

      {editId === todo.id && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <form onSubmit={handleSubmitEdit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onBlur={handleCancelEdit}
              onChange={event => setEditTitle(event.target.value)}
              value={editTitle || todo.title}
              ref={editInputRef}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div
              className="
                      modal-background has-background-white-ter
                      "
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </div>
  );
};
