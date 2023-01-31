import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { Todo } from '../types';
import { RenamingTodoByDoubleClick } from './RenamingTodoByDoubleClick';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  isRenamingTodo: boolean;
  setIsRenamingTodo: Dispatch<SetStateAction<boolean>>;
  selectedTodoById: number;
  dblClickHandler: (id: number) => void;
  updateTitleTodo: (value: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  deleteTodo,
  toggleTodo,
  isRenamingTodo,
  setIsRenamingTodo,
  selectedTodoById,
  dblClickHandler,
  updateTitleTodo,
}) => {
  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleTodo(id)}
        />
      </label>
      {isRenamingTodo && id === selectedTodoById ? (
        <RenamingTodoByDoubleClick
          oldValue={title}
          updateTitleTodo={updateTitleTodo}
          setIsRenamingTodo={setIsRenamingTodo}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => dblClickHandler(id)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
