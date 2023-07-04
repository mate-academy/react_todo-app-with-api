import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
  onUpdateTodo: (todoId: number, args: UpdateTodoArgs) => void
  handleShowError(error: string): void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  onRemoveTodo,
  loadingTodo,
  onUpdateTodo,
  handleShowError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingTodo = loadingTodo.includes(todo.id);

  const updateTodoHandler = async () => {
    setIsLoading(true);

    try {
      await onUpdateTodo(
        todo.id,
        { completed: !todo.completed },
      );
    } catch (error) {
      handleShowError('Unable to update a todo:');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={updateTodoHandler}
          disabled={isLoading}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', { 'is-active': isLoadingTodo })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
