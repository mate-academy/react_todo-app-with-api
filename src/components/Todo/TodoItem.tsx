import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../store/todoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    // prettier-ignore
    deleteSingleTodo,
    isLoading,
    toggleTodo,
    isUpdating,
    isTogglingAll,
  } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const todoToggle = () => {
    toggleTodo(todo.id);
  };

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
          defaultChecked={todo.completed}
          onChange={todoToggle}
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
            || (isLoading && todo.completed)
            || isUpdating === todo.id
            || isTogglingAll),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
