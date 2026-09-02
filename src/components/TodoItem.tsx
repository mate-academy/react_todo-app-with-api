import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isEdit: number | null;
  isLoader: boolean;
  handleDelete: (id: number) => void;
  handleUpdate: (id: number) => void;
  setIsEdit: React.Dispatch<React.SetStateAction<number | null>>;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  checkTodo: (id: number) => void;
  editValue: string;
  clickOut: React.RefObject<HTMLDivElement>;
}

const TodoItem = ({
  todo,
  isEdit,
  isLoader,
  handleDelete,
  handleUpdate,
  checkTodo,
  setIsEdit,
  setEditValue,
  editValue,
  clickOut,
}: TodoItemProps) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label
        className="todo__status-label"
        onClick={() => {
          checkTodo(todo.id);
        }}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Mark todo as completed"
        />
      </label>

      {isEdit === todo.id && (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setIsEdit(null);
              handleUpdate(todo.id);
            }
          }}
          onChange={e => {
            setEditValue(e.target.value);
          }}
          value={editValue}
        />
      )}

      {isEdit !== todo.id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEdit(todo.id);
            setEditValue(todo.title);
          }}
          ref={clickOut}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDelete(todo.id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      {isLoader && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div
            className="
                      modal-background 
                      has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
