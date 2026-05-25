import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  editingId: number | null;
  editingTitle: string;
  loadingIds: number[];
  handleToggle: (todo: Todo) => void;
  handleEditTodo: (todo: Todo) => void;
  handleSaveTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  onChangeEditingTitle: (title: string) => void;
  onChangeEditingId: (id: number | null) => void;
};

export const TodoItem = ({
  todo,
  editingId,
  editingTitle,
  loadingIds,
  handleToggle,
  handleEditTodo,
  handleSaveTodo,
  handleDeleteTodo,
  onChangeEditingTitle,
  onChangeEditingId,
}: TodoItemProps) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSaveTodo(todo);
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={event => onChangeEditingTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                onChangeEditingId(null);
                onChangeEditingTitle('');
              }
            }}
            onBlur={() => {
              handleSaveTodo(todo);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditTodo(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loadingIds.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
