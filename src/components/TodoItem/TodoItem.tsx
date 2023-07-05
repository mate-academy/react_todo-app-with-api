import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number[];
  toggleTodoStatus:(
    todoId: number,
    args: UpdateTodoArgs
  ) => Promise<Todo | null>;
  updatingTodosId: number[]
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingTodoId,
  toggleTodoStatus,
  updatingTodosId,
}) => {
  const isDeletingItem = deletingTodoId.includes(todo.id);
  const isUpdatingItem = updatingTodosId.includes(todo.id);

  const handleToggleTodoStatus = () => toggleTodoStatus(
    todo.id,
    { completed: !todo.completed },
  );

  return (
    <div
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodoStatus()}
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×

      </button>

      <div
        className={cn(
          'modal overlay',
          { ' is-active': isDeletingItem || isUpdatingItem },
        )}
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader " />
      </div>

    </div>
  );
};
