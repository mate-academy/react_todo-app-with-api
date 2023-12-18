import cn from 'classnames';
import { TodoInterface } from '../../types/TodoInterface';
import { Loader } from './loader';

type Props = {
  todo: TodoInterface;
  onDelete: (postId: number) => void;
  deletedPostsIds: number[];
  onComplete: (todo: TodoInterface) => void;
  editTodoId: number | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onEdit: (id: number) => void;
  update: (todo: TodoInterface) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  onDelete,
  deletedPostsIds,
  onComplete,
  editTodoId,
  editTitle,
  setEditTitle,
  onEdit,
  update,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    update(todo);
  };

  const onDoubleClick = () => {
    onEdit(todo.id);
    setEditTitle(todo.title);
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        completed: todo.completed,
      }, 'todo')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onComplete(todo)}
        />
      </label>

      {editTodoId === todo.id
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              onBlur={() => update(todo)}
            />
          </form>
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            role="textbox"
            tabIndex={0}
            onDoubleClick={onDoubleClick}
          >
            {todo.title}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {deletedPostsIds.includes(todo.id) && (
        <Loader />
      )}
    </div>
  );
};
