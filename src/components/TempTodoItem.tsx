import { Todo } from '../types/Todo';

type TempTodoItemProps = {
  todoItem: Todo;
};

export const TempTodoItem: React.FC<TempTodoItemProps> = ({
  todoItem,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todoItem.completed ? 'completed' : ''}`}
      key={todoItem.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoItem.completed}

        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"

      >
        {todoItem.title}
      </span>
      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
