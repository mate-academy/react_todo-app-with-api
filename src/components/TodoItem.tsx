import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (updatedTodo: Todo) => Promise<Todo>;
  onToggleCompletion: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onUpdate, onToggleCompletion }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const isTemporary = todo.id === 0;

  const handleTodoDoubleClick = () => {
    setIsEdit(true);
  }

  const handleBlur = async () => {
    if (isUpdating || newTitle.trim() === '') {

      onDelete(todo.id);
    return;
  }

  setIsUpdating(true);

  const updatedTodo = { ...todo, title: newTitle.trim() };

  try {
    await onUpdate(updatedTodo);
    setIsEdit(false);
  } catch {
    setIsEdit(true);
  } finally {
    setIsUpdating(false);
  }
};

const handleEnterKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    if (newTitle.trim() === '') {
      onDelete(todo.id);
    } else {
      if (newTitle.trim() !== todo.title) {
        await handleBlur();
      } else {
        setIsEdit(false);
      }
    }
  }
};

const handleEscapeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    setIsEdit(false);
    setNewTitle(todo.title);
  }
};

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handleTodoDoubleClick}>
      <label className="todo__status-label">
      { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleCompletion(todo.id)}
        />
      </label>

      {isEdit ? (
        <form
          onSubmit={(e) => {
          e.preventDefault();
          handleBlur();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            onBlur={handleBlur}
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyDown={handleEnterKey}
            onKeyUp={handleEscapeKey}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onClick={() => setIsEdit(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEdit && (
      <button type="button" className="todo__remove" data-cy="TodoDelete" onClick={() => onDelete(todo.id)} disabled={isTemporary || todo.isLoading}>
        ×
      </button>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className={classNames('modal overlay', { 'is-active' : isTemporary || todo.isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  )
}
