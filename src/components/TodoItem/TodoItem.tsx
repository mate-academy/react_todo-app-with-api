import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onToggleSingle: (todo: Todo) => void;
  onEditingTodoIdChange: (id: number | null) => void;
  onEditingTitleChange: (title: string) => void;
  editingTodoId: number | null;
  editingTitle: string;
  isProcessing: boolean;
  onDeleteTodo: (todoId: number) => void;
  onSubmit: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggleSingle,
  onEditingTodoIdChange,
  onEditingTitleChange,
  editingTodoId,
  editingTitle,
  isProcessing,
  onDeleteTodo,
  onSubmit,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`todo__status-${todo.id}`}>
        <span className="is-sr-only">Toggle todo status</span>
        <input
          id={`todo__status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleSingle(todo)}
        />
      </label>

      {editingTodoId !== todo.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={e => {
            e.preventDefault();
            onEditingTodoIdChange(todo.id);
            onEditingTitleChange(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <input
          className="todo__title-field"
          data-cy="TodoTitleField"
          type="text"
          value={editingTitle}
          onChange={e => onEditingTitleChange(e.target.value)}
          autoFocus
          placeholder={!editingTitle ? 'Empty todo will be delete' : ''}
          onBlur={() => onSubmit(todo)}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              onSubmit(todo);
            }

            if (e.key === 'Escape') {
              onEditingTodoIdChange(null);
            }
          }}
        />
      )}

      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
