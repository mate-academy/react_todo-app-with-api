import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  isActiveLoader: boolean;
  editTitle: string;
  setEditTitle: (title: string) => void;
  handleDelete: (todoId: number) => void;
  handleToggle: (todoId: number, completed: boolean) => void;
  handleEdit: (todo: Todo) => void;
  handleCancelEdit: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleUpdate: (todo: Todo) => void;
};

export const TodoItem = ({
  todo,
  isEditing,
  isActiveLoader,
  editTitle,
  setEditTitle,
  handleDelete,
  handleToggle,
  handleEdit,
  handleCancelEdit,
  handleUpdate,
}: TodoItemProps) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo.id, !todo.completed)}
          readOnly={isEditing}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleUpdate(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={() => handleUpdate(todo)}
            onKeyUp={handleCancelEdit}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEdit(todo)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <Loader isActive={isActiveLoader} />
    </div>
  );
};
