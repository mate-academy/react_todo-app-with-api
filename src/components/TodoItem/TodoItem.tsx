import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { RenameTodoForm } from '../RenameTodoForm';

interface Props {
  todo: Todo;
  onRemoveTodo: (todoId: number) => Promise<void>;
  loading: number[];
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  renamingId: number | null;
  setRenamingId: React.Dispatch<React.SetStateAction<number | null>>;
  handleRenameTodo: (todoId: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  loading,
  handleToggleTodo,
  renamingId,
  setRenamingId,
  handleRenameTodo,
}) => {
  const isLoading = loading.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggleTodo(todo.id, !todo.completed)}
        />
      </label>

      {renamingId === todo.id ? (
        <RenameTodoForm
          defaultValue={todo.title}
          onSubmit={newTitle => {
            if (newTitle.trim() === '') {
              onRemoveTodo(todo.id);
            } else {
              handleRenameTodo(todo.id, newTitle.trim());
            }
          }}
          setRenamingId={setRenamingId}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setRenamingId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
