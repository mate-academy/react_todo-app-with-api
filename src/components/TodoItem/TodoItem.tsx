/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { USER_ID, deleteTodo, updateTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  onChangeTodo: (newTodo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onErrorMessage: (error: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onChangeTodo,
  onDeleteTodo,
  onErrorMessage,
}) => {
  const { id, completed, title } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [todoStatus, setTodoStatus] = useState(completed);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        onDeleteTodo(todoId);

        if (isEditing) {
          setIsEditing(false);
        }
      })
      .catch(() => {
        onErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeTodo = (todoId: number, newTodoProp: string) => {
    setIsLoading(true);

    const updatedTodo: Todo = {
      id: todoId,
      userId: USER_ID,
      title: newTitle?.trim() || title,
      completed: newTodoProp === 'status' ? !todoStatus : todoStatus,
    };

    updateTodo(updatedTodo)
      .then(newTodo => {
        onChangeTodo(newTodo);

        if (newTodoProp === 'status') {
          setTodoStatus(!todoStatus);
        } else if (newTodoProp === 'title' && newTitle) {
          setNewTitle(newTitle.trim());
        }

        if (isEditing) {
          setIsEditing(false);
        }
      })
      .catch(() => {
        onErrorMessage('Unable to update a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDbClick = () => {
    setIsEditing(true);
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    const trimNewTitle = newTitle.trim();

    if (!trimNewTitle) {
      handleDeleteTodo(id);

      return;
    }

    handleChangeTodo(id, 'title');
  };

  const handleSubmitNewTitle = (e: React.FormEvent) => {
    e.preventDefault();

    const trimNewTitle = newTitle.trim();

    if (!trimNewTitle) {
      handleDeleteTodo(id);

      return;
    }

    if (trimNewTitle === title) {
      setIsEditing(false);

      return;
    }

    handleChangeTodo(id, 'title');
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
          onChange={() => handleChangeTodo(id, 'status')}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitNewTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleEdit}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDbClick}
          >
            {newTitle.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || todo.id === 0,
        })}
      >
        <div className={cn('modal-background', ' has-background-white-ter')} />
        <div className="loader" />
      </div>
    </div>
  );
};
