import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  handleDelete: (todoId: number) => void;
  handleToggle: (todo: Todo) => void;
  setEditTodo: (todo: Todo) => void;
  editTodo: Todo | null;
  handleEdit: (e: React.FormEvent<HTMLFormElement>,
    todo: Todo, editTitle: string) => void;
};

export const TodoItem: React.FC<TodoItemProps>
= ({
  todo, handleDelete, handleToggle, handleEdit, editTodo, setEditTodo,
}) => {
  const [editTitle, setEditTitle] = useState<string>('');
  const isLoading = todo.id === 0;
  const handleDoubleClick = (chosenTodo: Todo) => {
    setEditTodo(chosenTodo);
    setEditTitle(chosenTodo.title);
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
          <form onSubmit={e => handleEdit(e, editTodo, editTitle)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todotitle-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
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
      {/* overlay will cover the todo while it is being updated */}
      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
