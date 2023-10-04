import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleDelete: (todoId: number) => void;
  handleToggle: (todo: Todo) => void;
  setEditTodo: (todo: Todo | null) => void;
  editTodo: Todo | null;
  handleEdit: (
    todo: Todo, editTitle: string,
    e?: React.FormEvent<HTMLFormElement>) => void;
  activeTodosId: number[];
};

export const TodoItem: React.FC<TodoItemProps>
= ({
  todo, handleDelete, handleToggle, handleEdit, editTodo, setEditTodo,
  activeTodosId,
}) => {
  const [editTitle, setEditTitle] = useState<string>('');
  const inputEditedRef = useRef<HTMLInputElement | null>(null);
  const isLoading = todo.id === 0;

  useEffect(() => {
    if (inputEditedRef.current) {
      inputEditedRef.current?.focus();
    }
  }, [editTodo]);

  const handleDoubleClick = (chosenTodo: Todo) => {
    setEditTodo(chosenTodo);
    setEditTitle(chosenTodo.title);
  };

  const handleCancelEdit = () => {
    setEditTodo(null);
    setEditTitle('');
  };

  const handleBlur = () => {
    if (editTodo) {
      handleEdit(editTodo, editTitle);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggle(todo)}
        />
      </label>
      { editTodo?.id === todo.id

        ? (
          <form onSubmit={e => handleEdit(editTodo, editTitle, e)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelEdit();
                }
              }}
              onBlur={() => {
                if (inputEditedRef) {
                  handleBlur();
                }
              }}
              ref={inputEditedRef}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(todo)}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading
        || activeTodosId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
