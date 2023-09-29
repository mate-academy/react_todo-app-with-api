import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<void>;
  toggleTodo: (todo: Todo) => void;
  editedTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, toggleTodo, editedTodo,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const handleCancelEdit = () => {
    setEditing(false);
    setNewTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    if (newTitle.trim() === '') {
      await deleteTodo(todo.id);
    } else if (newTitle !== todo.title) {
      editedTodo({
        ...todo,
        title: newTitle,
      });
    }

    setEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleSaveEdit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
