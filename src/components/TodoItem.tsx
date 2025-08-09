/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoModify } from '../types/TodoModify';
import { useState } from 'react';
import { TodoRenameForm } from './TodoRenameForm';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onUpdateTodo: (todoId: Todo['id'], todo: TodoModify) => Promise<void>;
  isLoading: boolean;
}

export const TodoItem = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  isLoading,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEditing = () => setIsEditing(false);
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modifiedTodo: TodoModify = {
      completed: event.target.checked,
      title: todo.title,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, modifiedTodo);
  };

  const handleRenameTodo = (newTitle: string) => {
    if (newTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!newTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    const todoModify: TodoModify = {
      completed: todo.completed,
      title: newTitle,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, todoModify).then(() => {
      handleCancelEditing();
    });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>
      {isEditing ? (
        <TodoRenameForm
          currentTitle={todo.title}
          onRenameTodo={handleRenameTodo}
          onCancel={handleCancelEditing}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
