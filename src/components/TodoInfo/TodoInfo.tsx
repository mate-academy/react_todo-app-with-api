import classNames from 'classnames';
import { memo, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isAdding?: boolean;
  onUpdateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
  shouldShowLoader: boolean;
};

export const TodoInfo: React.FC<Props> = memo(
  ({
    todo,
    onDeleteTodo,
    isAdding,
    onUpdateTodo,
    shouldShowLoader,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleDeleteTodo = async (todoId: number) => {
      setIsLoading(true);

      await onDeleteTodo(todoId);

      setIsLoading(false);
    };

    const handleUpdateTodo = async (
      todoId: number,
      fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
    ) => {
      setIsLoading(true);

      await onUpdateTodo(todoId, fieldsToUpdate);

      setIsLoading(false);
    };

    // const isLoading = todo.id === 0 || isDeleting || isUpdating;

    return (
      <div
        data-cy="Todo"
        key={todo.id}
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => (
              handleUpdateTodo(todo.id, { completed: !todo.completed }))}
            defaultChecked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading || isAdding || shouldShowLoader,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
