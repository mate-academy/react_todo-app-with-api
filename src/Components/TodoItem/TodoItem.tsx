import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { Error } from '../../utils/Error';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void
  isLoading: boolean;
}
export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(todo);
  const { id, title, completed } = currentTodo;
  const handleDelete = (todoId: number) => {
    onDelete(todoId);
    setIsDeleted(true);
  };

  const handleTodoUpdate = async (updatedTodo: Todo) => {
    try {
      setCurrentTodo(updatedTodo);
      await updateTodo(updatedTodo);
    } catch {
      // eslint-disable-next-line no-console
      console.log(Error.UPDATE);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleTodoUpdate({ ...todo, completed: !completed })}
        />
      </label>

      {todo ? (
        <>
          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isDeleted || !isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
