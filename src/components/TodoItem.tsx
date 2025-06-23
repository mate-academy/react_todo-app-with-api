/* eslint-disable jsx-a11y/label-has-associated-control */

import cn from 'classnames';

import { Todo } from '../types/Todo';
import { ChangeEvent, useState } from 'react';
import { TodoModify } from '../types/TodoModify';
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

  const handlCancelEditing = () => setIsEditing(false);

  const handleStatusChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const modifyedTodo: TodoModify = {
      completed: event.target.checked,
      title: todo.title,
      userId: todo.userId,
    };

    await onUpdateTodo(todo.id, modifyedTodo);
  };

  const handleRenameTodo = (newTitle: string) => {
    if (todo.title === newTitle) {
      handlCancelEditing();

      return;
    }

    if (newTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    const todoModify: TodoModify = {
      title: newTitle,
      completed: todo.completed,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, todoModify).then(() => {
      handlCancelEditing();
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
          onCancel={handlCancelEditing}
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

          {/* Remove button appears only on hover */}
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

      {/* overlay will cover the todo while it is being deleted or updated */}
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
