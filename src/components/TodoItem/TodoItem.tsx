import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  loadingId: number[];
  removeTodo: (todoId: number) => void;
  changeTodo: (
    property: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    todoId: number,
  ) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  loadingId,
  removeTodo,
  changeTodo,
}) => {
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState(title);

  const handleDoubleClick = () => {
    setIsEditingId(id);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;

    setInputValue(currentValue);
  };

  const saveChanges = () => {
    if (inputValue.trim() && inputValue.trim() !== title.trim()) {
      changeTodo('title', inputValue, id);
      setIsEditingId(null);
    } else if (inputValue.trim() === '') {
      removeTodo(id);
    } else {
      setIsEditingId(null);
    }
  };

  const handleSubmitEditing = (event: React.FormEvent) => {
    event.preventDefault();

    saveChanges();
  };

  const handleBlur = () => {
    saveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingId(null);
    }
  };

  const handleToggle = () => {
    changeTodo('completed', !completed, id);
  };

  return (
    <div className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {(isEditingId === id) ? (
        <form
          onSubmit={handleSubmitEditing}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleTitleChange}
            value={inputValue}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {loadingId.includes(id) ? (
            inputValue
          ) : (
            title
          )}
          {/* {title} */}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          removeTodo(id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': (loadingId.includes(id)) },
        { 'is-active': (id === 0) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
