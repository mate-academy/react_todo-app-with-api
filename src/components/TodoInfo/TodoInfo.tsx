import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { PatchTodo } from '../../types/PatchTodo';
import { NewTodo } from '../NewTodo/NewTodo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  loadingTodo: number[];
  changeTodo: (id: number, data: PatchTodo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  loadingTodo,
  changeTodo,
}) => {
  const { completed, title, id } = todo;

  const [isNeedChange, setIsNeedChange] = useState(false);

  const handleDoubleClick = () => {
    setIsNeedChange(true);
  };

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => changeTodo(id, { completed: !completed })}
        />
      </label>

      {isNeedChange ? (
        <NewTodo
          changeTodo={changeTodo}
          todo={todo}
          onDelete={onDelete}
          onNeedChange={setIsNeedChange}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': loadingTodo.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
