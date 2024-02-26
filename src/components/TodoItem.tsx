import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { Error } from '../types/ErrorMessage';
import * as todoService from '../api/todos';
import { EditTodoForm } from './EditTodoForm';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const {
    updatingIds,
    deleteTodo,
    updateTodo,
    setErrorMessage,
    SetUpdatingIds,
  } = useContext(TodoContext);

  const handleDeleteTodo = (deleteId: number) => {
    SetUpdatingIds(deleteId);

    todoService
      .deleteTodo(deleteId)
      .then(() => deleteTodo(deleteId))
      .catch(() => setErrorMessage(Error.deleteTodo))
      .finally(() => SetUpdatingIds(null));
  };

  const handleToggleTodo = (updatedTodo: Omit<Todo, 'userId'>) => {
    SetUpdatingIds(updatedTodo.id);

    todoService
      .updateTodo(updatedTodo)
      .then(() => updateTodo(updatedTodo))
      .catch(() => setErrorMessage(Error.updateTodo))
      .finally(() => SetUpdatingIds(null));
  };

  const handleEditMode = (value: boolean) => {
    setIsEditing(value);
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      onDoubleClick={() => handleEditMode(true)}
      className={classNames('todo', {
        'todo completed': completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleToggleTodo({ id, title, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <EditTodoForm todo={todo} onEdit={handleEditMode} />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
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

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': updatingIds.includes(id),
        })}
      >
        <div /* eslint-disable-next-line */
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
