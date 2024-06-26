/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleTodoStatusChange: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoIds: number[];
  updateTodo: (object: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleTodoStatusChange,
  loadingTodoIds,
  updateTodo,
}) => {
  const [editedTodo, setEditedTodo] = useState<string>('');
  const [isDoubleClicked, setIsDoubleClicked] = useState<number | null>(null);

  const handleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodo(event.target.value);
  };

  const handleInputBlured = async () => {
    if (editedTodo.trim() === '') {
      handleDeleteTodo(todo.id);
    } else if (editedTodo.trim() === todo.title) {
      setIsDoubleClicked(null);
    } else {
      const newUpdatedTodo: Todo = {
        title: editedTodo.trim(),
        userId: todo.userId,
        id: todo.id,
        completed: todo.completed,
      };

      await updateTodo(newUpdatedTodo);
      setIsDoubleClicked(null);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await handleInputBlured();
    } else if (event.key === 'Escape') {
      setIsDoubleClicked(null);
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

      {isDoubleClicked === todo.id ? (
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
            onDoubleClick={() => setIsDoubleClicked(todo.id)}
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
      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
