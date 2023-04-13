import classNames from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  onUpdateTodo: (
    todoId: number,
    todo: { title?: string, completed?: boolean }) => void;
}

export const TodoTask: FC<Props> = ({
  todo,
  deleteTodo,
  onUpdateTodo,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  // const [query, setQuery] = useState(title);

  /* const handleUpdateTitle = () => {

  } */

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
