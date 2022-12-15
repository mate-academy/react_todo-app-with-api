import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loader: boolean;
  focusedTodoId: number;
  togglerLoader: boolean;
  onDeleteTodo: (value: number) => void;
  onUpdateTodo: (todoId: number, todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  loader,
  togglerLoader,
  focusedTodoId,
}) => {
  const handleDeleteButton = () => {
    onDeleteTodo(todo.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleStatusChange = async (todo: Todo) => {
    const todoWithChangedStatus = {
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: !todo.completed,
    };

    onUpdateTodo(todo.id, todoWithChangedStatus);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label
          className="todo__status-label"
          onChange={() => handleStatusChange(todo)}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

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
          onClick={() => handleDeleteButton()}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            {
              'is-active': (loader && focusedTodoId === todo.id)
                || togglerLoader,
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
