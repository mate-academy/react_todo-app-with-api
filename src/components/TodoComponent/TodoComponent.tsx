/* eslint-disable jsx-a11y/no-autofocus */
import { FC, KeyboardEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove?: (todoId: number) => void,
  isLoading?: boolean,
  onCheck?: (todo: Todo) => void,
  onEdit?: (todo: Todo, newValue: string) => void,
};

export const TodoComponent:FC<Props> = ({
  todo,
  onRemove,
  isLoading = false,
  onCheck,
  onEdit,
}) => {
  const { id, title, completed } = todo;
  const [inputValue, setInputValue] = useState(title);
  const [selectedTodoId, setSelectedTodoId] = useState(-1);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSelectedTodoId(-1);
      setInputValue(title);
    }
  };

  const handleEdit = (newValue: string) => {
    setSelectedTodoId(-1);
    if (newValue.trim() === title) {
      return;
    }

    if (newValue.trim().length === 0) {
      onRemove?.(id);

      return;
    }

    onEdit?.(todo, newValue);
  };

  return (
    <div
      data-cy="TodoComponent"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onCheck?.(todo)}
        />
      </label>

      {id === selectedTodoId ? (
        <form
          onSubmit={() => handleEdit(inputValue)}
        >
          <input
            data-cy="TodoTitleField"
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onBlur={() => handleEdit(inputValue)}
            onChange={event => setInputValue(event.currentTarget.value)}
            onKeyDown={handleKeyPress}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodoId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onRemove?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
