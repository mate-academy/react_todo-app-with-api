/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/store';
import { Todo } from '../../types/Todo';
import { Dispatchers } from '../../types/enums/Dispatchers';

interface Props {
  todo: Todo;
  isActive: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isActive }) => {
  const { dispatcher } = useContext(TodosContext);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const updatedInput = useRef<HTMLInputElement>(null);

  const { title, completed, id } = todo;

  const handleDeleteTodo = () => {
    dispatcher({ type: Dispatchers.DeleteWithId, payload: id });
  };

  const handleTitleUpdate = () => {
    if (updatedTitle.trim() === title) {
      setIsEdited(false);
      setUpdatedTitle(title);

      return;
    }

    if (!updatedTitle.trim()) {
      handleDeleteTodo();
    }

    dispatcher({
      type: Dispatchers.UpdateTodo,
      payload: {
        id,
        title: updatedTitle.trim(),
      },
    });
  };

  const onKeysHandler = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      setIsEdited(false);
      setUpdatedTitle(title);
    }
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleUpdate();
  };

  const onSetEdited = () => {
    setIsEdited(true);
  };

  const toggleStatus = () => {
    dispatcher({
      type: Dispatchers.UpdateTodo,
      payload: {
        id,
        completed,
      },
    });
  };

  useEffect(() => {
    setUpdatedTitle(title);
    setIsEdited(false);
  }, [title, completed]);

  useEffect(() => {
    if (isEdited) {
      updatedInput.current?.focus();
    }
  }, [isEdited]);

  useEffect(() => {
    if (isEdited && isActive) {
      updatedInput.current?.focus();
    }
  }, [isActive, isEdited]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          ref={checkbox}
          onChange={() => toggleStatus()}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {!isEdited
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClickCapture={onSetEdited}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo()}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={onFormSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              value={updatedTitle}
              onChange={(event) => setUpdatedTitle(event.target.value)}
              onBlur={handleTitleUpdate}
              ref={updatedInput}
              onKeyDown={onKeysHandler}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isActive },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
