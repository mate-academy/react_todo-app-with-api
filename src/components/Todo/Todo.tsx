/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { onComplete, onDelete } from '../../utils/requests';
import { DispatchContext } from '../../Store';
import { EditForm } from '../EditForm/EditForm';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);

  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const handleOnDelete = (id: number) => {
    onDelete(dispatch, id);
  };

  const handleToggle = (id: number, completed: boolean) => {
    onComplete(dispatch, id, !completed);
  };

  const handleOnDoubleClick = () => {
    setEdit(true);
    setEditTodo(todo);
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={handleOnDoubleClick}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo.id, todo.completed)}
        />
      </label>

      {edit ? (
        <EditForm editTodo={editTodo} setEdit={setEdit} />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleOnDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': todo.isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
