import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import * as todosApi from '../api/todos';

type Props = {
  todo: Todo;
  handleDeleteCurrentTodo: (value: number) => void;
  deletingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteCurrentTodo,
  deletingTodoId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleEditSave = async () => {
    setIsEditing(false);

    if (newTitle.trim() === '') {
      handleDeleteCurrentTodo(todo.id);
    } else if (newTitle !== todo.title) {
      try {
        todosApi.updateTodo({
          ...todo,
          title: newTitle,
        });
      } catch (error) {
        throw new Error('Unable to update a todo');
      }
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleEditSave}
          onKeyUp={(e) => {
            if (e.key === 'Escape') handleEditCancel();
            if (e.key === 'Enter') handleEditSave();
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteCurrentTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': deletingTodoId === todo.id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
