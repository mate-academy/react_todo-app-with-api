/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { RefObject, useEffect, useState } from 'react';
import { focusInput } from '../utils/services';

type Props = {
  todo: Todo;
  activeTodoId: number | null;
  inputRef: RefObject<HTMLInputElement>;
  onDelete: (todo: number) => void;
  onChange: (todo: Todo) => void;
  onUpdate: (todo: Todo, newTitle: string) => void;
  activeTodoList: number[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  activeTodoId,
  inputRef,
  onDelete,
  onChange,
  onUpdate,
  activeTodoList,
}) => {
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    focusInput(inputRef);
  }, [isEditing, inputRef]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleRenameSubmit = async () => {
    let errorMsg = false;

    if (newTitle.trim() === '') {
      try {
        await onDelete(todo.id);
      } catch (err) {
        if (err) {
          errorMsg = true;
        }

        focusInput(inputRef);
      }
    } else if (newTitle.trim() !== todo.title) {
      try {
        await onUpdate(todo, newTitle.trim());
      } catch (err) {
        if (err) {
          errorMsg = true;
        }

        focusInput(inputRef);
      }
    }

    if (errorMsg) {
      focusInput(inputRef);

      return;
    }

    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  const handleBlur = () => {
    handleRenameSubmit();
  };

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" htmlFor={`todo-checkbox-${id}`}>
        <input
          id={`todo-checkbox-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChange(todo)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === activeTodoId ||
            (activeTodoList && activeTodoList.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
