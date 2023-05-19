import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isCompleted: boolean;
  onUpdate: (todoId: number, completedStatus: boolean) => void;
  isUpdatingTodoId: number | null;
  isCurrentlyUpdating: boolean;
  onUpdateTodoTitle: (todoId: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isCompleted,
  onUpdate,
  isUpdatingTodoId,
  isCurrentlyUpdating,
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
    setNewTodoTitle(todo.title);
  };

  const upgradeTodo = () => {
    if (!newTodoTitle && isEditingTodoId) {
      handleDeleteTodo(isEditingTodoId);
    }

    if (newTodoTitle === todo.title) {
      setIsEditingTodoId(null);
      setNewTodoTitle(todo.title);

      return;
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

  const isActive = detedTodoId === todo.id
  || isCompleted
  || isUpdatingTodoId === todo.id
  || isCurrentlyUpdating;

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isEditingTodoId]);

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedCanhge(todo.id, !todo.completed)}
        />
      </label>

      {isEditingTodoId === todo.id
        ? (
          <form onSubmit={handleTitleFormSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onBlur={handleTitleBlur}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×

              </button>
            </>
          )
        )}

      <div className={cn('modal', 'overlay', {
        'is-active': isActive,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
