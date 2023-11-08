/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Todo) => void,
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  isLoading,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTodo = { ...todo, completed: event.target.checked };

    setIsCompleted(updatedTodo.completed);
    updateTodo(updatedTodo);
  };

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    edited: Todo,
  ) => {
    switch (e.detail) {
      case 2: {
        setIsEditing(true);
        setNewTodoTitle(edited.title);
        break;
      }

      default: {
        setIsEditing(false);
        break;
      }
    }
  };

  const handleButtons = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const updatedItem = { ...todo, title: newTodoTitle };

      if (updatedItem.title === todo.title) {
        return;
      }

      updateTodo(updatedItem);
      setIsEditing(false);
      setNewTodoTitle('');
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleCheckboxChange}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={(e) => handleDoubleClick(e, todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : isLoading ? (
        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            { 'is-active': isLoading },
          )}
        >
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleButtons}
          />
        </form>
      )}
    </div>
  );
};
