import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  isLoadingTodos: boolean;
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTitle: (title: string, id: number) => Promise<boolean>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoadingTodos,
  onToggle,
  onDeleteTodo,
  onEditTitle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };
  const finishEdit = () => {
    const newTitle = editTitle.trim();
    if (newTitle === '') {
      onDeleteTodo(todo.id);
      return;
    };
    if (newTitle === todo.title) {
      setIsEditing(false);
      return;
    };
    onEditTitle(newTitle, todo.id)
      .then((success) => {
        if (success) {
          setIsEditing(false);
        };
    });
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    finishEdit();
  };
  
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    };
  }

  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    };
  }, [isEditing]);

  useEffect(() => {
    setEditTitle(todo.title);
  }, [todo.title]);

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed === true ? 'completed' : ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoadingTodos}
        />
      </label>
      {isEditing
        ? <form onSubmit={handleSubmit}>
            <input 
              data-cy="TodoTitleField"
              type="text"
              value={editTitle}
              onChange={handleChange}
              ref={inputRef}
              onBlur={finishEdit}
              onKeyDown={handleKeyUp}
            />
          </form>
        : <span 
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
      }
    
      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoadingTodos}
          onClick={() => onDeleteTodo(todo.id)}
        >
          ×
        </button>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <TodoLoader isActive={isLoadingTodos} />
    </div>
  );
};
