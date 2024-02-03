/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';
import { EditForm } from '../EditForm';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editMode, setEditMode] = useState(false);

  const {
    handleUpdatingTodosIds,
    handleError,
    updateTodo,
    deleteTodo,
    updatingTodosIds,
  } = useContext(TodoContext);

  const handleCompleteTodo = (
    {
      title,
      completed,
      id,
    }: Omit<Todo, 'userId'>,
  ) => {
    handleUpdatingTodosIds(id);
    handleError('');

    updateTodos({ title, completed, id })
      .then(() => updateTodo({ title, completed, id }))
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleDeleteTodo = (id: number) => {
    handleUpdatingTodosIds(id);
    handleError('');

    deleteTodos(id)
      .then(() => deleteTodo(id))
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => handleUpdatingTodosIds(null));
  };

  const handleEditMode = (value: boolean) => {
    setEditMode(value);
  };

  const { title, completed, id } = todo;

  return (
    <li
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={() => handleEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleteTodo({
            title,
            completed: !completed,
            id,
          })}
        />
      </label>

      {editMode ? (
        <EditForm todo={todo} onEditMode={handleEditMode} />
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
        className={cn('modal overlay',
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
