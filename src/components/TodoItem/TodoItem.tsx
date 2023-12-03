import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';

interface Props {
  todo: Todo;
  removeTodo: (todo: Todo) => void;
  isTempTodo: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo, isTempTodo, removeTodo,
}) => {
  const { title, completed } = todo;

  const context = useContext(TodosContext);

  const { isLoader } = context;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todo)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': isTempTodo || isLoader === todo.id,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
