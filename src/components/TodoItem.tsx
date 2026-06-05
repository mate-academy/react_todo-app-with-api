/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  todoIdsInProgress: number[];
  handleToggleTodo: (todo: Todo) => void;
  handleRenameTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  setEditingTodoId,
  todoIdsInProgress,
  handleToggleTodo,
  handleRenameTodo,
  handleDeleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: editingTodoId === todo.id,
      })}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo)}
          disabled={todoIdsInProgress.includes(todo.id)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editingTitle}
          autoFocus
          onChange={event => setEditingTitle(event.target.value)}
          onBlur={() => handleRenameTodo(todo)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setEditingTodoId(null);
              setEditingTitle(todo.title);

              return;
            }

            if (event.key === 'Enter') {
              handleRenameTodo(todo);
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTodoId(todo.id);
            setEditingTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={todoIdsInProgress.includes(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todoIdsInProgress.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
