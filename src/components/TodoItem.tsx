import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => void;
  loading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  loading,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const editedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTodoField.current) {
      editedTodoField.current.focus();
    }
  }, [editedTodoId]);

  const saveChanges = () => {
    setEditedTodoId(null);
    if (newTitle !== todo.title) {
      onUpdateTodo(todo.id, { title: newTitle });
    }
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setEditedTodoId(null);
    saveChanges();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setNewTitle(todo.title);
    }
  };

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
          onChange={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {editedTodoId === todo.id ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={saveChanges}
            onKeyUp={handleKeyUp}
            ref={editedTodoField}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditedTodoId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            x
          </button>
        </>
      )}
      <div
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
