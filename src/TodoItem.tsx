import { Todo } from './types/todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: () => void;
  isLoading: boolean,
  updatingTodoIds: number[],
  handleStatusChange: (id: number) => Promise<void>,
}

export const TodoItem = (
  {
    todo, onDelete, isLoading, updatingTodoIds, handleStatusChange,
  }: TodoItemProps,
) => {
  return (
    <div
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleStatusChange(todo.id);
          }}
        />
      </label>

      <span
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
      // value="Todo is being edited now"
      />

      {/* overlay will cover the todo while it is being updated */}
      <div className={`modal overlay ${isLoading && updatingTodoIds.includes(todo.id) ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
