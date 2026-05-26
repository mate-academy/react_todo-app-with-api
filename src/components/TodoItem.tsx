import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoUpdate } from '../types/Todo.Update';
import { useCallback, useState } from 'react';
import { RenameTodoForm } from './RenameTodoForm';

type TodoProps = {
  todo: Todo;
  loading: boolean;
  onDelete?: (todoId: number) => void;
  onUpdate?: (
    todoId: number,
    data: TodoUpdate,
    callbacks?: {
      onSuccess?: (updatedTodo: Todo) => void;
      onError?: () => void;
    },
  ) => void;
};

export function TodoItem({
  todo,
  loading = false,
  onDelete = () => undefined,
  onUpdate = () => undefined,
}: TodoProps) {
  const [renaming, setRenaming] = useState(false);

  const handleToggleStatus = useCallback(
    (completed: boolean) => {
      const { id, ...updatedTodo }: Todo = {
        ...todo,
        completed,
      };

      onUpdate(id, {
        title: updatedTodo.title,
        completed: updatedTodo.completed,
        userId: updatedTodo.userId,
      });
    },
    [todo, onUpdate],
  );

  const handleRenameTodo = useCallback(
    (title: string) => {
      const { id, ...updatedTodo }: Todo = {
        ...todo,
        title,
      };

      onUpdate(
        id,
        {
          title: updatedTodo.title,
          completed: updatedTodo.completed,
          userId: updatedTodo.userId,
        },
        {
          onSuccess: () => {
            setRenaming(false);
          },
        },
      );
    },
    [todo, onUpdate],
  );

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => handleToggleStatus(event.target.checked)}
          readOnly
        />
      </label>

      {renaming ? (
        <RenameTodoForm
          defaultValue={todo.title}
          onSubmit={handleRenameTodo}
          onClose={() => setRenaming(false)}
          onDelete={() => onDelete(todo.id)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setRenaming(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
