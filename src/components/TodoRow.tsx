import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export type Props = {
  todo: Todo,
  showLoader?: boolean,
  removeTodo: (todoId: number) => void,
  showErrorBanner: (errorMsg: string) => void,
  reloadTodo: (todo: Todo) => void
};

export const TodoRow: React.FC<Props> = ({
  todo, showLoader = false, removeTodo, showErrorBanner, reloadTodo,
}) => {
  const [loadingProcess, setLoadingProcess] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => {
            setLoadingProcess(true);
            updateTodo(todo.id, { completed: !todo.completed })
              .then((updatedTodo) => reloadTodo(updatedTodo))
              .catch(() => showErrorBanner('Unable to update a todo'))
              .finally(() => setLoadingProcess(false));
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          setLoadingProcess(true);
          deleteTodo(todo.id)
            .then(() => removeTodo(todo.id))
            .catch(() => showErrorBanner('Unable to delete a todo'))
            .finally(() => setLoadingProcess(false));
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay',
          { 'is-active': showLoader || loadingProcess })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
