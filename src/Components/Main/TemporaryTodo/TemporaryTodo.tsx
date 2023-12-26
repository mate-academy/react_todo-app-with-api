import cn from 'classnames';
import { useTodoContext } from '../../../Context/Context';

export const TemporaryTodo = () => {
  const { tempTodo } = useTodoContext();

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: tempTodo?.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo?.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        { tempTodo?.title }
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
