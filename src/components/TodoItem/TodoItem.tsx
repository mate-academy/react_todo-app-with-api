import cn from 'classnames';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { useAppContext } from '../../AppContext';

type Props = {
  todo: TodoType
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo }) => {
    const {
      deleteTodo,
      selectedTodoIds,
      handleToggleCompleted,
      updateTodo,
      loadind,
      error,
    } = useAppContext();

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newTitle) {
        deleteTodo(todo.id);

        return;
      }

      if (newTitle.trim() === todo.title.trim()) {
        setIsEditing(false);

        return;
      }

      updateTodo({
        ...todo,
        title: newTitle.trim(),
      });

      setIsEditing(false);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing, error]);

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
        onDoubleClick={() => setIsEditing(true)}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() => handleToggleCompleted(todo)}
            checked={todo.completed}
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
              placeholder="Empty todo will be deleted"
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e)}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {loadind ? newTitle : todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': selectedTodoIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
