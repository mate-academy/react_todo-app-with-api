import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';
import { Error } from '../../types/Error';
import { EditForm } from '../EditForm';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    updatingTodosIds,
    deleteTodo,
    updateTodo,
    handleUpdatingTodosIds,
    handleError,
  } = useContext(TodoContext);

  const [editing, setEditing] = useState(false);

  const handleCompleteTodo = ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => {
    handleUpdatingTodosIds(id);
    handleError('');

    updateTodos({ id, title, completed })
      .then(() => updateTodo({ id, title, completed }))
      .catch(() => {
        handleError(Error.Update);
      })
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleDeleteTodo = (id: number) => {
    handleUpdatingTodosIds(id);
    handleError('');

    deleteTodos(id)
      .then(() => deleteTodo(id))
      .catch(() => {
        handleError(Error.Delete);
      })
      .finally(() => handleUpdatingTodosIds(null));
  };

  const { id, title, completed } = todo;

  const handleEditing = (value: boolean) => {
    setEditing(value);
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => handleEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleteTodo({
            id,
            title,
            completed: !completed,
          })}
        />
      </label>

      {editing ? (
        <EditForm
          todo={todo}
          onEditing={handleEditing}
        />
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
        className={classNames('modal overlay',
          { 'is-active': updatingTodosIds.includes(id) })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
