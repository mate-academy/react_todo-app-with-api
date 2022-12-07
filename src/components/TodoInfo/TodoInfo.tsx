import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteButton?: (todoId: number) => void;
  isAdding?: boolean;
  isActive?: boolean;
  handleUpdateTodoStatus?: (todo: Todo) => void;
  handleNewTodoTitle?: (todo: Todo, newTodoTitle: string) => void;
};

export const TodoInfo: React.FC<Props>
= React.memo(({
  todo, handleDeleteButton, isAdding, handleNewTodoTitle,
  isActive, handleUpdateTodoStatus,
}) => {
  const [isInputChange, setIsInputChange] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);
  const newTodoTitleField = useRef<HTMLInputElement>(null);
  const handleDeleteOnClick = () => {
    if (handleDeleteButton) {
      handleDeleteButton(todo.id);
    }
  };

  const handleUpdateOnClick = () => {
    if (handleUpdateTodoStatus) {
      handleUpdateTodoStatus(todo);
    }
  };

  const handleChangeTitle = () => {
    setIsInputChange(false);

    if (newTodoTitle.trim().length === 0) {
      handleDeleteOnClick();

      return;
    }

    setNewTodoTitle(newTodoTitle.trim());
    if (handleNewTodoTitle) {
      handleNewTodoTitle(todo, newTodoTitle.trim());
    }
  };

  const handleInputOnBlur = () => {
    handleChangeTitle();
  };

  const handleInputChange
= (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewTodoTitle(event.target.value);
};

  const handleKeyDownChange
= (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Escape') {
    setIsInputChange(false);
    setNewTodoTitle(todo.title.trim());
  }
};

  const handleFormOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleChangeTitle();
  };

  useEffect(() => {
    if (newTodoTitleField.current) {
      newTodoTitleField.current.focus();
    }
  }, [isInputChange]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleUpdateOnClick}
        />
      </label>
      {isInputChange ? (
        <form onSubmit={handleFormOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={newTodoTitleField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDownChange}
            onBlur={handleInputOnBlur}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsInputChange(true)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteOnClick}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isAdding || isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
