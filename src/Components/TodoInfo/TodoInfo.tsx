import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateForm } from '../UpdateForm';

type Props = {
  todo: Todo;
  loadingTodos: number[];
  removeTodo: (todoId: number) => void;
  updateTodoInfo: (
    todoId: number,
    newTodoData: Partial <Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>;
};

export const TodoInfo: FC<Props> = ({
  todo,
  loadingTodos,
  removeTodo,
  updateTodoInfo,
}) => {
  const { id, title, completed } = todo;

  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteButton = () => {
    removeTodo(id);
  };

  const handleToggleComplete = async () => {
    await updateTodoInfo(id, { completed: !todo.completed });
  };

  return (
    <div
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleToggleComplete}
        />
      </label>

      {isUpdating
        ? (
          <UpdateForm
            title={title}
            id={id}
            updateTodoInfo={updateTodoInfo}
            removeTodo={removeTodo}
            setIsUpdating={setIsUpdating}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsUpdating(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteButton}
            >
              ×
            </button>

          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
