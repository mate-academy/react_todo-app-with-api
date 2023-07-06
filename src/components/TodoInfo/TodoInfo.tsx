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
  handleErrorThrow: (error: string) => void;
}

export const TodoInfo: FC<Props> = ({
  todo,
  onRemoveTodo,
  loadingTodo,
  onUpdateTodo,
  handleErrorThrow,
}) => {
  const { id, completed, title } = todo;
  const isLoadingTodo = loadingTodo.includes(id);
  const handleRemoveTodo = () => {
    onRemoveTodo(id);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const submitTitle = () => {
    try {
      if (newTitle.trim() === '') {
        onRemoveTodo(id);
      } else if (newTitle.trim() !== title) {
        setIsEditing(false);
        onUpdateTodo(id, { title: newTitle });
      } else {
        setIsEditing(false);
      }
    } catch {
      handleErrorThrow('Unable to update a todo');
    }
  };

  const handleSubmitTitle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitTitle();
  };

  const handleCancelEditingTitle = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      if (newTitle.trim() === '') {
        handleRemoveTodo();
      } else {
        submitTitle();
      }
    }

    if (event.key === 'Escape') {
      handleCancelEditingTitle();
    }
  };

  const handleBlur = () => {
    if (newTitle.trim() === '') {
      handleRemoveTodo();
    } else {
      submitTitle();
    }
  };

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleStatusEditing = () => {
    try {
      onUpdateTodo(id, { completed: !completed });
    } catch {
      handleErrorThrow('Unable to update a todo');
    }
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusEditing}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitTitle} onBlur={handleBlur}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span className="todo__title" onDoubleClick={handleEditTitle}>
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemoveTodo}
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
