import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoadingId: boolean;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo, onDelete = () => {}, isLoadingId, updateTodo,
}) => {
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmitNewTodos = () => {
    if (todo.title === newTitle) {
      setDoubleClick(false);
    }

    if (newTitle.trim().length === 0) {
      onDelete(todo.id);
    }

    const newTodo = {
      id: todo.id,
      title: newTitle,
      completed: todo.completed,
      userId: 11281,
    };

    updateTodo(newTodo);
    setDoubleClick(false);
  };

  const handleCheckbox = () => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  const handleFocusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    handleSubmitNewTodos();
  };

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={handleCheckbox}

        />
      </label>
      {doubleClick
        ? (
          <form
            method="POST"
            onSubmit={handleSubmitNewTodos}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleFocusChange}
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => setDoubleClick(true)}
          >
            {todo.title}
          </span>
        )}
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
        disabled={isLoadingId}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated  modal */}
      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoadingId },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>

  );
};
