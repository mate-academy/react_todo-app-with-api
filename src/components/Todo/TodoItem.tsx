import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../store/todoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo }) => {
  const { deleteSingleTodo, deleting } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
        onClick={() => deleteSingleTodo(todo.id, setIsDeleting)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          // prettier-ignore
          'is-active': todo && (todo.id === 0
            || isDeleting
            || (deleting && todo.completed)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
