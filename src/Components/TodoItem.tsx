/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Prop {
  todo: Todo;
  handleToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  tempTodo: boolean;
  isDelete: boolean;
  loadingTodoId: boolean;
  startEditing: (id: number | null, currentTitle: string) => void;
  saveTitle: (id: number) => void;
  editingTodoId: number | null;
  setEditingTitle: (args: string) => void;
  editingTitle: string;
}

export const TodoItem: React.FC<Prop> = ({
  todo,
  handleToggle,
  handleDelete,
  tempTodo,
  isDelete,
  loadingTodoId,
  startEditing,
  saveTitle,
  editingTodoId,
  setEditingTitle,
  editingTitle,
}) => {
  const { title, completed, id } = todo;

  const isEditing = editingTodoId === id;

  const onBlur = () => {
    saveTitle(id);
  };

  const onDoubleClick = () => {
    startEditing(id, title);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveTitle(id);
    }

    if (e.key === 'Escape') {
      setEditingTitle(title);
      startEditing(null, '');
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        onDoubleClick={onDoubleClick}
        className={classNames('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => {
              if (!isEditing) {
                handleToggle(id);
              }
            }}
            disabled={isEditing || tempTodo}
          />
        </label>

        {isEditing ? (
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editingTitle}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus
          />
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {title}
          </span>
        )}

        {!isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            id={
              todo.id !== undefined && todo.id !== null
                ? todo.id.toString()
                : ''
            }
            onClick={() => handleDelete(todo.id)}
            disabled={tempTodo}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': tempTodo || isDelete || loadingTodoId,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
