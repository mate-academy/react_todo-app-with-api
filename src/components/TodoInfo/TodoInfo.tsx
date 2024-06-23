/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';

interface Props {
  todoInfo: Todo;
  todosForProcesing?: number[];
  updatedTodo: Todo | null;
  onDelete: (id: number[]) => void;
  onUpdate: (updatedTodo: Todo[]) => void;
  onSelectTodo: (selectedTodo: Todo | null) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todoInfo,
  todosForProcesing,
  updatedTodo,
  onDelete = () => {},
  onUpdate = () => {},
  onSelectTodo,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState('');

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoInfo.completed,
      })}
      key={todoInfo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoInfo.completed}
          onClick={() => {
            onUpdate([
              {
                ...todoInfo,
                completed: !todoInfo.completed,
              },
            ]);
          }}
        />
      </label>

      {updatedTodo?.id === todoInfo.id ? (
        <input
          data-cy="TodoTitle"
          type="text"
          className="todo__title-field"
          value={updatedTitle}
          // ref={focusField}
          onChange={event => setUpdatedTitle(event.target.value)}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onSelectTodo(todoInfo);
              setUpdatedTitle(todoInfo.title);
            }}
            onSubmit={() => {
              onUpdate([
                {
                  ...todoInfo,
                  title: updatedTitle,
                },
              ]);
              onSelectTodo(null);
            }}
          >
            {todoInfo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete([todoInfo.id]);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosForProcesing?.includes(todoInfo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
