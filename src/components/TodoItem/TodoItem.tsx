import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../TodosProvider';
import { errorMessages } from '../ErrorNotification';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { deleteTodo, selectedTodoIds, updateTodo, setErrorMessage } =
    useTodos();

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleToggleTodo = async () => {
    try {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      updateTodo(updatedTodo);
    } catch (error) {
      setErrorMessage(errorMessages.unableToUpdateTodo);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Enter' || event.key === 'Escape') {
      if (event.key === 'Enter') {
        const updatedTodo = { ...todo, title: editedTitle };

        updateTodo(updatedTodo);
      }

      setEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTodo = { ...todo, title: editedTitle };

    updateTodo(updatedTodo);

    setEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${cn({
        completed: todo.completed,
      })}`}
      key={todo.id}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onKeyUp={handleKeyUp}
          />
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': selectedTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </form>
      ) : (
        <>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleToggleTodo}
              aria-label="Todo status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': selectedTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
