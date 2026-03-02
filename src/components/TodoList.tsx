import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  deletingIds: number[];
  completingIds: number[];
  editingId: number | null;
  editingIds: number[];
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleDelete: (id: number) => void;
  handleComplete: (id: number, completed: boolean) => void;
  handleStartEdit: (todo: Todo) => void;
  handleEditTodo: (id: number, title: string) => void;
  handleCancelEdit: () => void;
};

export const TodoList = ({
  todos,
  isAdding,
  deletingIds,
  completingIds,
  editingId,
  editingIds,
  editingTitle,
  setEditingTitle,
  handleDelete,
  handleComplete,
  handleStartEdit,
  handleEditTodo,
  handleCancelEdit,
}: Props) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id === 0 ? 'temp-todo' : todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            {' '}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleComplete(todo.id, !todo.completed)}
            />
          </label>

          {editingId === todo.id ? (
            <input
              ref={editInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onBlur={() => handleEditTodo(todo.id, editingTitle)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleStartEdit(todo)}
            >
              {todo.title}
            </span>
          )}

          {editingId !== todo.id && (
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
              'is-active':
                (todo.id === 0 && isAdding) ||
                deletingIds.includes(todo.id) ||
                completingIds.includes(todo.id) ||
                editingIds.includes(todo.id),
              'is-hidden': !(
                (todo.id === 0 && isAdding) ||
                deletingIds.includes(todo.id) ||
                completingIds.includes(todo.id) ||
                editingIds.includes(todo.id)
              ),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
