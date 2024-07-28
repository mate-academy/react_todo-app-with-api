/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  loadingIds: number[];
  selectedTodo: Todo | null;
  updateTodo: (todo: Todo) => void;
  handleTitle: (id: number, newTitle: string) => void;
  escapeKeyHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  doubleClick: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingIds,
  selectedTodo,
  updateTodo,
  handleTitle,
  escapeKeyHandler,
  doubleClick,
}) => {
  const { id, title, completed } = todo;
  const loadingIdscheck = loadingIds.includes(id);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    if (selectedTodo?.id === id) {
      setNewTitle(title);
    }
  }, [selectedTodo, id, title]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTitle(todo.id, newTitle);
  };

  const handleBlur = () => {
    handleTitle(id, newTitle);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            updateTodo({
              ...todo,
              completed: !completed,
            })
          }
        />
      </label>

      {selectedTodo?.id === id ? (
        <form onSubmit={onFormSubmit}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todoapp__new-todo todoapp__new-todo--update"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={escapeKeyHandler}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => doubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            x
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIdscheck,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
