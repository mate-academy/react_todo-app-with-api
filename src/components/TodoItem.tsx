import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoEditForm } from './TodoEditForm';
import { TodoLoader } from './TodoLoader';
import { useTodoContext } from '../context/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { handleDelete, handleToggle, handleUpdate, loadingTodos, tempTodo } =
    useTodoContext();
  const isLoading = loadingTodos.includes(todo.id) || todo === tempTodo;

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = async (newTitle: string) => {
    if (newTitle.trim()) {
      const result = await handleUpdate(todo.id, newTitle);
      if (result) {
        setIsEditing(false);
      }
    } else {
      const result = await handleDelete(todo.id);
      if (result) {
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo.id)}
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`}
        />
      </label>

      {isEditing ? (
        <TodoEditForm
          title={todo.title}
          onTitleChange={handleTitleChange}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isLoading={isLoading} />
    </div>
  );
};
