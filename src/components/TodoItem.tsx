import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { EditingForm } from './EditingForm';
import { TodosContext } from '../context/TodosContext';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingTodos,
    toggleStatus,
    handleTodoDelete,
  } = useContext(TodosContext);

  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        [TodoStatus.Editing]: isEditing,
        [TodoStatus.Completed]: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => toggleStatus(todo)}
        />
      </label>

      {isEditing
        ? <EditingForm setIsEditing={setIsEditing} todo={todo} />
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleTodoDelete(todo.id)}
            >
              ×
            </button>

          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': todo.id === 0 || loadingTodos.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
