import React, {
  useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void;
  isLoading: boolean | number;
  setIsLoading: (value: boolean | number) => void;
  setTodosError: (error: ErrorMessage) => void;
  onTodoUpdate?: (todo: Todo) => Promise<void>;
  isNew: boolean;
  isDeleting: boolean;
  processingTodoId: number[];
  setUpdatedTodos: (value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  isLoading,
  setIsLoading,
  setTodosError,
  onTodoUpdate,
  isNew,
  isDeleting,
  processingTodoId,
  setUpdatedTodos,
}) => {
  const [tempId, setTempId] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const deleteTodoHandler = async (todoId: number) => {
    setTempId(todoId);
    setIsLoading(true);

    try {
      await deleteTodos(todoId);
      setTodos(todos.filter(t => t.id !== todoId));
    } catch (error) {
      setTodosError(ErrorMessage.UnableToDeleteTodo);
    } finally {
      setIsLoading(false);
      setTempId(-1);
    }
  };

  const handleToggle = () => {
    onTodoUpdate?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setUpdatedTodos(true);

    event.preventDefault();

    if (!newTitle.length) {
      deleteTodoHandler?.(todo.id);
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await onTodoUpdate?.({
        ...todo,
        title: newTitle.trim(),
      });

      setIsEditing(false);
    } catch {
      setTodosError(ErrorMessage.UnableToUpdateTodo);
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);

      setNewTitle(todo.title);

      return;
    }

    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
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
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={newTitle}
            onChange={(event => setNewTitle(event.target.value))}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoHandler(todo.id)}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active':
              ((processingTodoId.includes(todo.id)) || isNew || isDeleting)
              || (isLoading && todo.id === tempId),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
