import React, { useState } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { EditForm } from '../EditForm';

type Props = {
  todo: Todo,
  onDeleteTodo: (value: number) => void,
  todosIdInProcess: number[],
  onToggleComplete: (todo: Todo) => void,
  onHandleEditTodo: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  todosIdInProcess,
  onToggleComplete,
  onHandleEditTodo,
}) => {
  const [isFormActive, setIsFormActive] = useState(false);
  const { id, title, completed } = todo;

  const handleModalShow = () => {
    setIsFormActive(true);
  };

  return (
    <div
      className={classnames('todo',
        {
          completed,
        })}
      onDoubleClick={handleModalShow}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onToggleComplete(todo);
          }}
          checked
        />
      </label>
      {isFormActive && (
        <EditForm
          todoForChange={todo}
          onHandleEditTodo={onHandleEditTodo}
          onModalClose={setIsFormActive}
          onDeleteTodo={onDeleteTodo}
        />
      )}
      {!isFormActive && (
        <>
          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              onDeleteTodo(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={classnames('modal overlay', {
        'is-active': todosIdInProcess.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
