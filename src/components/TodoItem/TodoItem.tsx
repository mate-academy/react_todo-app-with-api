/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEdited: boolean;
  onEditTodo?: (id: number | null) => void;
  onTodoDelete?: (todoId: number) => void;
  onTodoUpdate?: (id: number, updatedTodo: Partial<Todo>) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  isLoading,
  isEdited,
  onEditTodo = () => {},
  onTodoDelete = () => {},
  onTodoUpdate = () => {},
}) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState<string>(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTodoDelete = (todoId: number) => {
    onTodoDelete(todoId);
  };

  const handleUpdateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      onTodoDelete(id);
    } else if (title === newTitle) {
      onEditTodo(null);
    } else {
      onTodoUpdate(id, { title: newTitle.trim() });
    }
  };

  const handleEdit = (todoId: number) => {
    onEditTodo(todoId);
  };

  const handleStatusChange = () => {
    onTodoUpdate(id, { completed: !completed });
  };

  const handleEscKeyEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      onEditTodo(null);
    }
  };

  useEffect(() => {
    if (isEdited) {
      inputRef.current?.focus();
    }
  }, [isEdited]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      {!isEdited ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEdit(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(id)}
          >
            x
          </button>
        </>
      ) : (
        <form onBlur={handleUpdateTodo} onSubmit={handleUpdateTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value.trimStart())}
            onKeyUp={handleEscKeyEvent}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
