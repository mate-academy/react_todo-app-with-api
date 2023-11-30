import cn from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  isLoading: boolean;
  handleTodoDelete?: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = true,
  handleTodoDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [newCompleted, setNewCompleted] = useState(todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedUpdateTodo = useCallback(
    debounce(updateTodo, 100),
    [],
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!newTitle) {
      return;
    }

    const newTitleUpdate = {
      id: todo.id,
      userId: todo.userId,
      title: newTitle,
      completed: todo.completed,
    };

    debouncedUpdateTodo(newTitleUpdate);
  }, [newTitle, todo, debouncedUpdateTodo]);

  return (
    <div
      data-cy="Todo"
      className={cn({
        completed: todo.completed,
      }, 'todo')}
      key={todo.id}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={newCompleted}
          onChange={() => {
            setNewCompleted(!newCompleted);
            updateTodo({ ...todo, completed: newCompleted });
          }}
        />
      </label>
      {!isEditing
        ? (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDelete}
            >
              ×
            </button>
          </>
        ) : (
          <form>
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                  setNewTitle(todo.title);
                }

                if (event.key === 'Enter') {
                  setIsEditing(false);
                  setNewTitle(newTitle);
                }
              }}
            />
          </form>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
