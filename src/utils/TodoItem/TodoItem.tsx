/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { ItemProps, Todo } from '../../types/Todo';

export const TodoItem: React.FC<ItemProps> = ({
  todo,
  handleDeleteTodo,
  handleTodoStatusChange,
  loadingTodoIds,
  updateTodo,
}) => {
  const [editedTodo, setEditedTodo] = useState<string>('');
  const [isDoubleClicked, setIsDoubleClicked] = useState<boolean>(false);

  const handleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodo(event.target.value);
  };

  const handleInputBlured = async () => {
    if (editedTodo.trim() === '') {
      handleDeleteTodo(todo.id);
    } else if (editedTodo.trim() === todo.title) {
      setIsDoubleClicked(false);
    } else {
      const newUpdatedTodo: Todo = {
        title: editedTodo.trim(),
        userId: todo.userId,
        id: todo.id,
        completed: todo.completed,
      };

      await updateTodo(newUpdatedTodo);
      setIsDoubleClicked(false);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await handleInputBlured();
    } else if (event.key === 'Escape') {
      setIsDoubleClicked(false);
      setEditedTodo(todo.title);
    }
  };

  const isLoading = loadingTodoIds.includes(todo.id);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleTodoStatusChange(todo.id)}
          disabled={isLoading}
        />
      </label>

      {isDoubleClicked ? (
        <input
          data-cy="TodoInput"
          className="todo__title-field"
          defaultValue={todo.title}
          onChange={handleInputChanged}
          onBlur={handleInputBlured}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClicked(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? `is-active` : ``}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
