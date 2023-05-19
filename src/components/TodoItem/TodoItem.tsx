import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isCompleted: boolean;
  onUpdate: (todoId: number, completedStatus: boolean) => void;
  isUpdatingTodoId: number | null;
  isUpdating: boolean;
  onUpdateTodoTitle: (todoId: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isCompleted,
  onUpdate,
  isUpdatingTodoId,
  isUpdating,
  onUpdateTodoTitle,
}) => {
  const [detedTodoId, setDeletedTodoId] = useState(0);
  const [isEditingTodoId, setIsEditingTodoId] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodoId(id);
    onDeleteTodo(id);
  };

  const handleCompletedCanhge = (todoId: number, completedStatus: boolean) => {
    onUpdate(todoId, completedStatus);
  };

  const handleDoubleClick = (todoId: number) => {
    setIsEditingTodoId(todoId);
  };

  const upgradeTodo = () => {
    if (!newTodoTitle && isEditingTodoId) {
      handleDeleteTodo(isEditingTodoId);
    }

    if (isEditingTodoId) {
      setIsEditingTodoId(null);
      onUpdateTodoTitle(isEditingTodoId, newTodoTitle);
    }
  };

  const handleTitleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    upgradeTodo();
  };

  const handleTitleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    upgradeTodo();
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditingTodoId(null);
      setNewTodoTitle(todo.title);
    }
  };

  const isActive
    = detedTodoId === todo.id
    || isCompleted
    || isUpdatingTodoId === todo.id
    || isUpdating;

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isEditingTodoId]);

  const { title, id, completed } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedCanhge(id, !completed)}
        />
      </label>

      {isEditingTodoId === id ? (
        <form onSubmit={handleTitleFormSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            onBlur={handleTitleBlur}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
