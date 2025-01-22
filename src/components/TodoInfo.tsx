/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  completeTodo: (todoId: number) => void;
  changingTodo: Todo | undefined;
  setChangingTodo: (tochangingTododoId: Todo | undefined) => void;
  changedTitle: string;
  setChangedTitle: (changedTitle: string) => void;
  deleteTodo: (todoId: number) => void;
  handleTitleChange: (event: React.FormEvent, updatedTodo: Todo) => void;
  loadingTodos: Todo[] | null;
};

export const TodoInfo: React.FC<Props> = ({
  todo: { title, completed, id, userId },
  completeTodo,
  changingTodo,
  setChangingTodo,
  changedTitle,
  setChangedTitle,
  deleteTodo,
  handleTitleChange,
  loadingTodos,
}) => (
  <>
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => completeTodo(id)}
        />
      </label>

      {changingTodo?.id !== id && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setChangingTodo({ title, completed, id, userId });
              setChangedTitle(title);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {changingTodo?.id === id && (
        <form
          onSubmit={event =>
            handleTitleChange(event, { title, completed, id, userId })
          }
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={changedTitle}
            onChange={event => {
              setChangedTitle(event.target.value);
            }}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setChangingTodo(undefined);
                setChangedTitle('');
              }
            }}
            onBlur={event =>
              handleTitleChange(event, { title, completed, id, userId })
            }
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos?.find(loadingTodo => loadingTodo.id === id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  </>
);
