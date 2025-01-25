/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  deleteSelectTodo: (id: number) => void;
  isLoadingById: boolean;
  handleUpdateComplete: (todo: Todo) => void;
  handleTitleEdit: (title: string, todo: Todo) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteSelectTodo,
  isLoadingById,
  handleUpdateComplete,
  handleTitleEdit,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleSaveEditedTitle = async () => {
    if (editedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (editedTitle.length === 0) {
      deleteSelectTodo(todo.id);
    } else if (editingTodoId && editedTitle.trim()) {
      try {
        const result = await handleTitleEdit(editedTitle.trim(), todo);

        if (result) {
          setEditingTodoId(null);
        }
      } catch (error) {
        setEditingTodoId(todo.id);
      }
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleUpdateComplete(todo)}
        />
      </label>
      {editingTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSaveEditedTitle();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSaveEditedTitle}
            onKeyUp={handleEscapeKey}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
          >
            {editedTitle.trim()}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteSelectTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoadingById,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
