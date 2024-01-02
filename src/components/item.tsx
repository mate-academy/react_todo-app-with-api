import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number[]) => void,
  todoLoadingId: number[],
  setSelectedTodo: (todo: Todo) => void,
  selectedTodo: Todo | null,
  onUpdatePost: (todo: Todo) => Promise<{ isError: boolean } | undefined>,
}

export const Item: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  todoLoadingId,
  setSelectedTodo,
  selectedTodo,
  onUpdatePost,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const hadleToggle = () => {
    onUpdatePost({
      ...todo,
      completed: !todo.completed,
    });
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTodo?.title === newTitle) {
      setIsEditing(false);

      return;
    }

    if (!newTitle?.length) {
      onDeleteTodo([todo.id]);
    }

    if (newTitle.length > 0) {
      onUpdatePost?.({
        ...todo,
        title: newTitle.trim(),
      });
    }

    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={hadleToggle}
        />
      </label>

      {isEditing && selectedTodo?.id === todo.id ? (
        <>
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              ref={titleField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event => setNewTitle(event.target.value))}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
            />
          </form>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': todoLoadingId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodo(todo);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDeleteTodo([todo.id]);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoLoadingId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
