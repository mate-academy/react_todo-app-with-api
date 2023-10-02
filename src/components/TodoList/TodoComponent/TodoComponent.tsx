import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../../types/Todo';
import { useTodosProvider } from '../../../providers/TodosContext';

type TodoComponentProps = {
  todo: Todo,
};

export const TodoComponent: React.FC<TodoComponentProps> = ({ todo }) => {
  const {
    handleDoubleClick, toggleCompleted, handleRemove,
  } = useTodosProvider();

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
      onDoubleClick={() => handleDoubleClick(todo.id)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleRemove(todo.id)}
      >
        ×
      </button>

      <TodoLoader todo={todo} />
    </div>
  );
};
