/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';

type PropsItem = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  selectedIds: number[];
  onToggle: (updatedTodo: Todo) => void;
  handleEditing: (todoId: number) => void;
  handleSave: (todoId: number, newTitle: string) => void;
  editingId: number | null;
  editingTitle: string;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  isTemp?: boolean;
};

export const TodoItem: React.FC<PropsItem> = ({
  todo,
  onDelete,
  selectedIds,
  onToggle,
  handleEditing,
  handleSave,
  editingId,
  editingTitle,
  setEditingId,
  setEditingTitle,
  isTemp = false,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {editingId === todo.id ? (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          placeholder="Empty todo will be deleted"
          value={editingTitle}
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={() => handleSave(todo.id, editingTitle)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave(todo.id, editingTitle);
            }

            if (e.key === 'Escape') {
              setEditingId(null);
            }
          }}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditing(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': selectedIds.includes(todo.id) || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
