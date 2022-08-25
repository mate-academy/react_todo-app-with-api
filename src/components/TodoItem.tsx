import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = (props) => {
  const { todos, onDelete } = props;

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId)
      .then(res => {
        if (res) {
          onDelete(todoId);
        }
      });
  };

  return (
    <>
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </>
  );
};
