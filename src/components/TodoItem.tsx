import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  handleTodoComplited:(id: number) => void;
  isLoading:boolean;
  setDeletingId:React.Dispatch<React.SetStateAction<number | null>>
  deletingId:number | null;
  handleTodoEdit:(id: number, EditTitle:string) => void
}

export const TodoItem: FC<Props> = ({
  todo,
  handleDeleteTodo,
  deletingId,
  setDeletingId,
  handleTodoComplited,
  isLoading,
  handleTodoEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleCansleEditing = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement> |
  React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (title === todo.title) {
      setIsEditing(false);
      setTitle(todo.title);

      return;
    }

    handleTodoEdit(todo.id, title);
    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
      key={todo.id}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => {
            handleTodoComplited(todo.id);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyUp={(event) => handleCansleEditing(event)}
            onBlur={handleTitleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              handleDeleteTodo(todo.id);
              setDeletingId(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': isLoading && deletingId === todo.id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
