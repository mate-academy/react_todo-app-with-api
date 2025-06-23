/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ChangeEvent, useState } from 'react';
import { TodoModify } from '../types/TodoModify';
import { TodoRenameForm } from './TodoRenameForm';

interface TodoItemsProps {
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
}: TodoItemsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEdding = () => setIsEditing(false);

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiTodo: TodoModify = {
      completed: event.target.checked,
      title: todo.title,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, modifiTodo).then(() => {
      handleCancelEdding();
    });
  };

  const handleRenameTodo = async (newTitle: string): Promise<void> => {
    if (todo.title === newTitle) {
      handleCancelEdding();

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

    try {
      await onUpdateTodo(todo.id, todoModify);
      handleCancelEdding();
    } catch (error) {
      throw error;
    }
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
          onCancel={handleCancelEdding}
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
