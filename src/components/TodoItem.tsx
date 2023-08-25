import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  handleTodoStatus: (todoId: number, completed: boolean) => void,
  isEditing: number | null,
  editingHandler: (id: number) => void,
  editingTitle: string,
  setEditingTitle: (title: string) => void,
  cancelEdit: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  setIsEditing: (id: number) => void,
  deleteTodo: (id: number) => void,
  isInProcces: number[],
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  handleTodoStatus,
  isEditing,
  editingHandler,
  editingTitle,
  setEditingTitle,
  cancelEdit,
  setIsEditing,
  deleteTodo,
  isInProcces,
  todo,
}) => {
  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {isEditing === todo.id
        ? (
          <form onSubmit={() => editingHandler(todo.id)}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              onBlur={() => editingHandler(todo.id)}
              onKeyUp={cancelEdit}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(todo.id);
                setEditingTitle(todo.title);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isInProcces.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
