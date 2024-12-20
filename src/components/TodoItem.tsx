import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (updatedTodo: Todo) => void;
  onToggleCompletion: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onUpdate, onToggleCompletion }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isTemporary = todo.id === 0;

  const handleTodoDoubleClick = () => {
    setIsEdit(true);
  }

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
            setIsEdit(false);
            onUpdate({ ...todo, title: newTitle });
          }}
        >
          <input
            type="text"
            className="todo__input"
            onBlur={() => {
              setIsEdit(false)
              onUpdate({ ...todo, title: newTitle });
            }}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEdit(false);
                onUpdate({ ...todo, title: newTitle });
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      )}

      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove" data-cy="TodoDelete" onClick={() => onDelete(todo.id)} disabled={isTemporary}>
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className={classNames('modal overlay', { 'is-active' : isTemporary || todo.isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  )
}
