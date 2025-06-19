/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { UpdateTodoForm } from './UpdateTodoForm';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onUpdateTodoStatus: (
    todoId: Todo['id'],
    todo: Omit<Todo, 'id'>,
  ) => Promise<void>;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
  onUpdateTodoStatus,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState(false);

  const handleTodoStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiedTodo: Omit<Todo, 'id'> = {
      completed: event.target.checked,
      title: todo.title,
      userId: todo.userId,
    };

    onUpdateTodoStatus(todo.id, modifiedTodo);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      {isEditingTodo ? (
        <UpdateTodoForm
          todo={todo}
          onUpdateTodo={onUpdateTodoStatus}
          onCancel={() => setIsEditingTodo(false)}
          onDelete={onDeleteTodo}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditingTodo(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
