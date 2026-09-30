import { EditingTodo } from '../../types/EditingTodo';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  onEdit?: (todo: Todo) => void;
  editingTodo?: EditingTodo | null;
  onEditTitleChange?: (title: string) => void;
  onEditSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onEditBlur?: () => void;
  onEditKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};
/* eslint-disable jsx-a11y/label-has-associated-control */

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onEdit,
  editingTodo,
  onEditTitleChange,
  onEditSubmit,
  onEditBlur,
  onEditKeyUp,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => onToggle?.(todo)}
      />
    </label>
    {editingTodo?.id === todo.id ? (
      <form onSubmit={onEditSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editingTodo.title}
          onChange={event => onEditTitleChange?.(event.target.value)}
          onBlur={onEditBlur}
          onKeyUp={onEditKeyUp}
          autoFocus
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEdit?.(todo)}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      </>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
