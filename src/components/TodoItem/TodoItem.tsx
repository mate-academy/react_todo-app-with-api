/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef, useState, FC } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  loadingTodoId: number[];

  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (todoToUpdate: Todo) => void;

  editedTodo: Todo | null;
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoItem: FC<Props> = ({
  todo,
  loadingTodoId,
  onDeleteTodo,
  onUpdateTodo,
  editedTodo,
  setEditedTodo,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const isBeingEdited = editedTodo?.id === todo.id;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTitle = newTitle.trim();

    if (!preparedTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    if (preparedTitle === todo.title) {
      setEditedTodo(null);

      return;
    }

    onUpdateTodo({ ...todo, title: preparedTitle });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodo(null);
      setNewTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isBeingEdited) {
      inputRef.current?.focus();
    }
  }, [isBeingEdited]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={!todo.id}
          onChange={event =>
            onUpdateTodo({ ...todo, completed: event.target.checked })
          }
        />
      </label>

      {editedTodo === todo ? (
        <form onSubmit={handleSaveChanges} onBlur={handleSaveChanges}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setEditedTodo(todo)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoId.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
