/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC /* , useState */ } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { PayloadProps } from '../types/PayloadProps';

interface Props {
  todo: Todo;
  removeTodo?: (id: number) => void;
  updateTodo?: (id: number, payload: PayloadProps) => Promise<void>;
  loadingIds?: number[];
}

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo = () => {},
  updateTodo = () => {},
  loadingIds = [],
}) => {
  // const [showForm, setShowForm] = useState(false);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {/* {showForm ? (
        <form method="POST" onSubmit={() => {}}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todo todo__title"
            placeholder="What needs to be done?"
            name={'title'}
            value={todo.title}
            onChange={() => {}}
            onBlur={() => setShowForm(false)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setShowForm(true)}
        >
          {todo.title}
        </span>
      )} */}

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => {}}
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
