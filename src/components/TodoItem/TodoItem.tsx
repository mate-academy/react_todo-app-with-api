import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (todo: Todo) => void,
  handleToggleTodo: (id: number) => void,
  handleUpdateTodo: (todo: Todo) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleToggleTodo,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const todotitle = useRef<HTMLInputElement | null>(null);

  const handleSaveOnBlur = () => {
    if (newTitle.trim()) {
      handleUpdateTodo({ ...todo, title: newTitle });
    } else {
      handleDeleteTodo(todo);
    }

    setNewTitle('');
    setIsEditing(false);
  };

  const handleEditTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isEditing) {
      handleSaveOnBlur();
    } else
    if (event.key === 'Escape' && isEditing) {
      setNewTitle('');
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && todotitle.current) {
      todotitle.current.focus();
    }

    setNewTitle(todo.title);
  }, [isEditing, todo.title]);

  const { title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
        editing: isEditing,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleToggleTodo(todo.id)}
        />
      </label>

      {isEditing ? (
        <input
          ref={todotitle}
          type="text"
          className="todo__title-field"
          value={newTitle}
          onChange={handleEditTitle}
          onBlur={handleSaveOnBlur}
          onKeyUp={handleEditTodo}
        />
      ) : (
        <>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
