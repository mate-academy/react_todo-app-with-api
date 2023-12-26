import { FC } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType,
  deleteTodo: (todoId: number) => void,
  loading: boolean,
  isTemporary?: boolean,
  updateTodo?: (updatedTodo: TodoType) => Promise<void>,
  setLoadingTodoId?: (loadingTodoId: number[]) => void,
}

export const Todo: FC<Props> = (props) => {
  const {
    todo,
    deleteTodo,
    loading,
    isTemporary,
    updateTodo,
    setLoadingTodoId,
  } = props;

  const handleToggle = async () => {
    setLoadingTodoId?.([todo.id]);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await updateTodo?.(newTodo);
    setLoadingTodoId?.([]);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loading || isTemporary,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
