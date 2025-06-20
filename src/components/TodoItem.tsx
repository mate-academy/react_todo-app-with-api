import { ChangeEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoRenameForm } from './TodoRenameForm';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, todo: Omit<Todo, 'id'>) => Promise<void>;
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

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const modifiedTodo: Omit<Todo, 'id'> = {
      completed: event.target.checked,
      title: todo.title,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, modifiedTodo);
  };

  const handleRenameTodo = (newTitle: string) => {
    if (todo.title === newTitle) {
      handleCancelEditing();

      return;
    }

    if (newTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    const todoModify: Omit<Todo, 'id'> = {
      title: newTitle,
      completed: todo.completed,
      userId: todo.userId,
    };

    onUpdateTodo(todo.id, todoModify).then(() => {
      handleCancelEditing();
    });
  };

  return (
    <div
      key={todo.id}
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
          aria-label="Toggle todo status"
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
