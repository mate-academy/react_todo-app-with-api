import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type PropTypes = {
  todo: Todo;
  handleDeleteTodo: (todoDel: Todo) => void;
  deletingId: number[];
  handleUpdate: (newField: Partial<Todo>) => void;
};

export const TodoItem: React.FC<PropTypes> = ({
  todo,
  handleDeleteTodo,
  deletingId,
  handleUpdate,
}) => {
  const { completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(title);
  const todoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        inputRef.current?.blur();
      }

      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewValue(newValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startEditing = () => setIsEditing(true);
  const finishEditing = () => setIsEditing(false);

  useEffect(() => {
    todoRef.current?.addEventListener('dblclick', startEditing);

    return () => todoRef.current?.removeEventListener('dblclick', startEditing);
  }, []);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (!newValue) {
      handleDeleteTodo(todo);
    }

    if (title !== newValue) {
      handleUpdate({ title: newValue });
    }

    finishEditing();
  };

  const handleToggle = () => {
    handleUpdate({ completed: !completed });
  };

  return (
    <div
      ref={todoRef}
      className={classNames(
        'todo',
        { completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={completed}
          className="todo__status"
          onChange={handleToggle}
        />
      </label>

      {isEditing
        ? (
          <form>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onChange={event => {
                setNewValue(event.target.value);
              }}
              value={newValue}
              onBlur={handleRename}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(todo)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': todo.id === 0
              || deletingId.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
