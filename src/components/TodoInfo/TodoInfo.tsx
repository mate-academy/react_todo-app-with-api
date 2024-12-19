/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props {
  todo: Todo;
  todosForUpdate?: Todo[];
  idsForDelete?: number[];
  error?: ErrorMessages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTodosChange?: any;
  onDeleteTodo?: (ids: number[]) => void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  todosForUpdate,
  idsForDelete,
  error,
  onTodosChange = () => {},
  onDeleteTodo = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleUpdateTodoTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    } else if (!newTitle) {
      onDeleteTodo([todo.id]);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: newTitle.trim(),
    };

    onTodosChange([updatedTodo]).then(() => setIsEditing(false));
  };

  const handlePressEscape = (key: string) => {
    if (key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }

    return;
  };

  const handleUpdateTodoStaus = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    onTodosChange([updatedTodo]);
  };

  const isActive =
    !todo.id ||
    idsForDelete?.includes(todo.id) ||
    todosForUpdate?.some(currTodo => currTodo.id === todo.id);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing, error]);

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
        key={todo.id}
        onDoubleClick={() => setIsEditing(true)}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleUpdateTodoStaus}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleUpdateTodoTitle} onBlur={handleUpdateTodoTitle}>
            <input
              data-cy="TodoTitleField"
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.currentTarget.value)}
              onKeyUp={event => handlePressEscape(event.key)}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo([todo.id])}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isActive,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
