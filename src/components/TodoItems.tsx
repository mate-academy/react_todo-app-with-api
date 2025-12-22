import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoUpdateTitleForm } from './TodoUpdateTitleForm';

type TodoProps = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: Todo['id']) => void;
  onUpdate: (
    todoId: Todo['id'],
    body: Omit<Todo, 'id'>,
    onSuccess?: () => void,
  ) => void;
};

export const TodoItems = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
}: TodoProps) => {
  const [editing, setEditing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { id: todoId, ...todoBody } = todo;

  const handleToggleStatus = (completed: boolean) => {
    onUpdate(todoId, {
      ...todoBody,
      completed,
    });
  };

  const handleRename = (title: Todo['title']) => {
    if (title === todo.title) {
      setEditing(false);

      return;
    }

    if (!title) {
      onDelete(todoId);

      return;
    }

    onUpdate(
      todoId,
      {
        ...todoBody,
        title,
      },
      () => {
        setEditing(false);
      },
    );
  };

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditing(false);
      }
    };

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div>
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className='todo__status-label'>
        <input
          aria-label={`Mark todo "${todo.title}" as completed`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => handleToggleStatus(event.target.checked)}
        />
      </label>

      {editing ? (
        <TodoUpdateTitleForm
          defaultValue={todo.title}
          onSubmit={handleRename}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setLocalLoading(true);
              onDelete(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || localLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
    </div>
  );
};
