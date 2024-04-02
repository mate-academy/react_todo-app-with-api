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
  const { id, title, completed, isLoading } = todo;
  const dispatch = useContext(DispatchContext);

  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const handleOnDelete = (i: number) => {
    onDelete(dispatch, i);
  };

  const handleToggle = (i: number, c: boolean) => {
    onComplete(dispatch, i, !c);
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
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggle(id, completed)}
        />
      </label>

      {edit ? (
        <EditForm editTodo={editTodo} setEdit={setEdit} />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleOnDelete(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': isLoading,
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
