import classNames from 'classnames';
import React from 'react';
// import { toggleStatus } from '../../../api/todos';

interface Props {
  id: number,
  title: string,
  completed: boolean,
  removeTodo: (id: number) => void;
  isAdding: boolean;
  loadingTodos: number[];
  setLoadingTodos: (removedId: number[]) => void;
  toggleTodoStatus: (id: number, completed: boolean) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  removeTodo,
  isAdding,
  loadingTodos,
  setLoadingTodos,
  toggleTodoStatus,
}) => {
  const remove = () => {
    setLoadingTodos([...loadingTodos, id]);
    removeTodo(id);
  };

  const toggle = () => {
    toggleTodoStatus(id, completed);
    setLoadingTodos([...loadingTodos, id]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => toggle()}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => remove()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': loadingTodos.includes(id) || isAdding },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
