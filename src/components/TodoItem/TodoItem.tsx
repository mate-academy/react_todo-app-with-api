import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  onUpdateTodo: (updatedTodo: Todo) => void;
  updateToggle: (toggleTodo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdateTodo,
  updateToggle,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState(false);
  const [updatedTitleTodo, setUpdatedTitleTodo] = useState(todo.title);

  const updatedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTodo && updatedInput.current) {
      updatedInput.current?.focus();
    }
  }, [isEditingTodo]);

  useEffect(() => setIsEditingTodo(false), [todo]);

  const { id, title, completed } = todo;

  const handleSubmit = () => {
    const correctTitle = updatedTitleTodo.trim();

    if (correctTitle === title) {
      setIsEditingTodo(false);

      return;
    }

    if (!correctTitle) {
      onDelete(id);

      return;
    }

    setUpdatedTitleTodo(correctTitle);

    onUpdateTodo({ ...todo, title: correctTitle });
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyEvent = (keyEvent: React.KeyboardEvent<HTMLInputElement>) => {
    switch (keyEvent.key) {
      case 'Enter':
        keyEvent.preventDefault();
        handleSubmit();
        break;
      case 'Escape':
        setUpdatedTitleTodo(todo.title);
        setIsEditingTodo(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditingTodo) {
      setIsEditingTodo(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitleTodo(event.target.value);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {/* remove */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateToggle(todo)}
        />
      </label>

      {isEditingTodo ? (
        <form>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitleTodo}
            ref={updatedInput}
            onBlur={handleBlur}
            onKeyDown={handleKeyEvent}
            onChange={handleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {updatedTitleTodo}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
