import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  processingIds: number[],
  onDelete: (id: number) => void,
  onToggle: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  isSubmiting: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processingIds,
  onDelete,
  onToggle,
  togglingId,
  onUpdate,
  isSubmiting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTodoTitleChange = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const currentTodoTitle = todo.title;

    if (newTodoTitle === currentTodoTitle) {
      setIsEditing(false);
    } else if (!newTodoTitle.trim()) {
      onDelete(todo.id);
    } else {
      setIsEditing(true);
      const todoUpdateData = { title: newTodoTitle };

      updateTodo(todo.id, todoUpdateData)
        .then((updatedTodo) => {
          setIsEditing(false);
          onUpdate(updatedTodo.id, updatedTodo);
        })
        .catch(() => {
          setIsEditing(false);
          onUpdate(todo.id, todo);
        });
    }
  };

  const handleChangeCompletedStatus = () => {
    onToggle(todo.id, todo.completed);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const isActive = () => {
    return processingIds.includes(todo.id)
      || togglingId === todo.id || isSubmiting;
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompletedStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            ref={inputRef}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            onBlur={handleFormSubmit}
            onKeyUp={handleKeyUp}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <span
          className="todo__title"
          data-cy="TodoTitle"
          onDoubleClick={handleTodoTitleChange}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={isActive()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': isActive(),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
