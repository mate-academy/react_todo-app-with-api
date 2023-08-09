import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
  onUpdateTodo: (todoId: number, args: UpdateTodoArgs) => void;
  handleShowError: (error: string) => void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  onRemoveTodo,
  loadingTodo,
  onUpdateTodo,
  handleShowError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const isLoadingTodo = loadingTodo.includes(todo.id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmitTitle = async () => {
    try {
      if (newTitle.trim() === '') {
        onRemoveTodo(todo.id);
      } else if (newTitle.trim() !== todo.title) {
        setIsEditing(false);
        await onUpdateTodo(todo.id, { title: newTitle });
      } else {
        setIsEditing(false);
      }
    } catch {
      handleShowError('Unable to update a todo');
    }
  };

  const handleCancelEditingTitle = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmitTitle();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditingTitle();
    }
  };

  const handleBlur = () => {
    handleSubmitTitle();
  };

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const editStatusHandler = () => {
    try {
      onUpdateTodo(todo.id, { completed: !todo.completed });
    } catch {
      handleShowError('Unable to update a todo');
    }
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={editStatusHandler}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={handleTitleChange}
          onKeyUp={handleKeyUp}
          ref={inputRef}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleEditTitle}>
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemoveTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
