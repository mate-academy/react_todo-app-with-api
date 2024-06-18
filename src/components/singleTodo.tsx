/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  editingTodoId: number | null;
  handleEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editingTitle: string;
  handleEditBlur: () => void;
  handleEdit: (todo: Todo) => void;
  loader: number[];
  handleEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateTodoStatus: (updatedTodo: Todo) => Promise<void>;
  handleDelete: (todoId: number) => void;
};

export const SingleTodo: React.FC<Props> = ({
  todo,
  editingTodoId,
  handleEditSubmit,
  editingTitle,
  handleEditBlur,
  handleEdit,
  loader,
  handleEditChange,
  onUpdateTodoStatus,
  handleDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onUpdateTodoStatus(todo)}
          disabled={loader.length !== 0}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
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

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loader?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
