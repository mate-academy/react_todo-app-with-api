/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoUpdate } from '../types/TodoUpdate';
import { useCallback, useState } from 'react';
import { RenameTodoForm } from './RenameTodoForm';

type TodoItemProps = {
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
}: TodoItemProps) {
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

  const handleRemoveButton = () => {
    onDelete(todo.id);
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
          checked={todo.completed}
          onChange={event => handleToggleStatus(event.target.checked)}
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
            onDoubleClick={() => {
              setRenaming(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveButton}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
