/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-autofocus */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (todoId: number) => () => void;
  isStatusUpdating: boolean;
  onUpdateStatus: (todo: Todo) => () => void;
  isTitleUpdating: boolean;
  editedTitleValue: string;
  onUpdateTitle: (todo: Todo) => () => void;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitUpdatedTitle: (
    todo: Todo,
  ) => (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.FocusEvent<HTMLInputElement, Element>,
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  onDelete,
  isStatusUpdating,
  onUpdateStatus,
  isTitleUpdating,
  editedTitleValue,
  onUpdateTitle,
  onChangeTitle,
  onSubmitUpdatedTitle,
}) => {
  return (
    <div key={todo.id} className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={onUpdateStatus({ ...todo, completed: !todo.completed })}
        />
      </label>

      {!isTitleUpdating && (
        <span className="todo__title" onDoubleClick={onUpdateTitle(todo)}>
          {todo.title}
        </span>
      )}

      {!isTitleUpdating && (
        <button
          type="button"
          className="todo__remove"
          onClick={onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {isTitleUpdating && (
        <form onSubmit={onSubmitUpdatedTitle(todo)}>
          <input
            type="text"
            className="todoapp__new-todo"
            autoFocus
            value={editedTitleValue}
            onChange={onChangeTitle}
            onBlur={onSubmitUpdatedTitle(todo)}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        {(isDeleting || isStatusUpdating || isTitleUpdating) && (
          <div className="loader" />
        )}
      </div>
    </div>
  );
};
