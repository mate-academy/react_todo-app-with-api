/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loadingTodos: Todo['id'][];
  changedTodo: Todo | null;
  todoTitleToChange: string;
  onTodoTitleToChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangedTodo: (todo: Todo) => void;
  onHandleDeleteTodo: (todoId: Todo['id']) => void;
  onToggleStatus: (todo: Todo) => void;
  onSubmitTitle: (
    event: React.FormEvent<HTMLFormElement>,
    updatedTodo: Todo,
  ) => void;
  onHandleTitleChange: (updatedTodo: Todo | null) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loadingTodos,
  onHandleDeleteTodo,
  onToggleStatus,
  changedTodo,
  onChangedTodo,
  todoTitleToChange,
  onTodoTitleToChange,
  onSubmitTitle,
  onHandleTitleChange,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onToggleStatus(todo)}
        />
      </label>

      {changedTodo?.id === todo.id ? (
        <form onSubmit={e => onSubmitTitle(e, changedTodo)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleToChange}
            onChange={onTodoTitleToChange}
            onBlur={() => onHandleTitleChange(changedTodo)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                onHandleTitleChange(null);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onChangedTodo(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onHandleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
