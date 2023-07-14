import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { BatchOperations } from '../../types/BatchOperations';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  title: string;
  id: number;
  completed: boolean;
  allLoading: boolean;
  allComplete: boolean;
  batchOperation: string | null;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (id: number, todo: Partial<Todo>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  title,
  id,
  completed,
  allLoading,
  allComplete,
  batchOperation,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleComplete = () => {
    setIsLoading(true);
    onUpdateTodo(id, { completed: !completed });
  };

  const handleDelete = () => {
    setIsLoading(true);
    onDeleteTodo(id);
  };

  const handleUpdateTitle = () => {
    setIsEditingEnabled(false);

    if (newTitle === title) {
      return;
    }

    if (newTitle.trim().length > 0) {
      setIsLoading(true);
      onUpdateTodo(id, { title: newTitle });
    } else {
      handleDelete();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isEditingEnabled) {
      setIsEditingEnabled(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [completed, title]);

  useEffect(() => {
    if (allLoading) {
      setIsLoading(true);

      if (batchOperation === BatchOperations.COMPLETE) {
        onUpdateTodo(id, { completed: !allComplete });
      } else if (batchOperation === BatchOperations.CLEAR && completed) {
        handleDelete();
      }
    } else {
      setIsLoading(false);
    }
  }, [allLoading]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleComplete()}
        />
      </label>

      {isEditingEnabled ? (
        <>
          <form onSubmit={() => handleUpdateTitle()}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={() => handleUpdateTitle()}
              onKeyUp={handleKeyUp}
              ref={inputRef}
            />
          </form>
        </>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditingEnabled(true)}
          >
            {title}
          </span>
        </>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete()}
      >
        ×
      </button>

      <div className={classNames('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
