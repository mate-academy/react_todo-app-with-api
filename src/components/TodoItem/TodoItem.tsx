import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void;
  loadingTodosIds: number[];
  onUpdate: (todoId: number, fieldsToUpdate: Todo) => void;
};

export const TodoItem: FC<Props> = (props) => {
  const {
    todo, onDelete, loadingTodosIds, onUpdate,
  } = props;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            onUpdate(todo.id, { ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {false && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue="JS"
          />
        </form>
      )}

      {true && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': todo.id === 0 || loadingTodosIds.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
