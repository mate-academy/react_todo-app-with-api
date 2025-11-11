import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isEditing?: boolean;
  isLoading?: boolean;
  onDeleteTodo: (id: Todo['id']) => Promise<void>;
  onChangeTodoStatus: (id: Todo['id'], completed: boolean) => Promise<void>;
  onSetIsEditing: (todo: Todo | null) => void;
  query: string;
  onSetQuery: (value: string) => void;
  onUpdateTodo: (id: Todo['id'], query: string) => Promise<void>;
};

export const TodoComp: React.FC<Props> = ({
  todo,
  isEditing = false,
  isLoading = false,
  onDeleteTodo,
  onChangeTodoStatus,
  onSetIsEditing,
  query,
  onSetQuery,
  onUpdateTodo,
}) => {
  const isCompleted = todo?.completed ?? false;

  const handleExitFormField = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Escape') {
      onSetIsEditing(null);
      onSetQuery(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      <label
        htmlFor={`todo-${todo.id}`}
        className="todo__status-label"
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onClick={() => onChangeTodoStatus(todo.id, !todo.completed)}
          readOnly
        />
      </label>
      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onSetIsEditing(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      {isEditing && (
        <form
          onSubmit={event => {
            event.preventDefault();
            onUpdateTodo(todo.id, query);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={event => onSetQuery(event.target.value.trimStart())}
            onBlur={() => onUpdateTodo(todo.id, query)}
            onKeyUp={handleExitFormField}
            autoFocus
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
