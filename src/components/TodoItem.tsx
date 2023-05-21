import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  handleTodoComplited:(id: number) => void;
  isLoading:boolean;
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
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
  setIsLoading,
  handleTodoEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement> |
  React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!todo.title.trim()) {
      handleDeleteTodo(todo.id);

      return;
    }

    handleTodoEdit(todo.id, title);
    setIsEditing(false);
  };

  return (
    <div
      className={cn('todo',
        { completed: todo.completed })}
      key={todo.id}
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
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              setIsLoading(true);
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
