import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';
import { USER_ID } from '../api/todos';

interface TodoItemProps {
  deleteTodo: (todoId: number) => void;
  todo: Todo;
  isLoading: boolean;
  selectTodoId: number | null;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  updateTodo: (updatedTodo: Todo) => void;
  loaderUptadeTodo: number | null;
  selectTodoIds: number[];
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isLoading,
  deleteTodo,
  selectTodoId,
  editingTodoId,
  setEditingTodoId,
  updateTodo,
  loaderUptadeTodo,
  selectTodoIds,
}) => {
  const [editedTitle, setEditedTitle] = useState(title);

  const handleDoubleClick = () => {
    setEditingTodoId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedTitle.trim()) {
      deleteTodo(id);

      return;
    }

    try {
      await updateTodo({
        id,
        userId: USER_ID,
        title: editedTitle,
        completed,
      });
    } catch {
    } finally {
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
      onDoubleClick={handleDoubleClick}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            updateTodo({ id, userId: USER_ID, title, completed: !completed })
          }
          id={`todo-${id}`}
        />
      </label>

      {editingTodoId === id ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingTodoId(null);
                setEditedTitle(title);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {editedTitle}
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
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            (isLoading && id === 0) ||
            selectTodoId === id ||
            loaderUptadeTodo === id ||
            selectTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
