import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type TTempTodoProps = {
  tempTodo: Todo;
};

export const TempTodo: FC<TTempTodoProps> = ({
  tempTodo,
}) => {
  return (
    <div
      key={tempTodo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: tempTodo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={tempTodo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
