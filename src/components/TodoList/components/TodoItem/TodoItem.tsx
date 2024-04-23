/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './todo.scss';
import { useContext } from 'react';
import { todosContext } from '../../../../Store';
import { TodoWithLoader } from '../../../../types/TodoWithLoader';
import { handleUpdate } from '../../../../utils/handleUpdate';
import { item } from '../../../../utils/utils';
type Props = { todo: TodoWithLoader };

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [{ selectedTodo }, setters] = useContext(todosContext);
  const { id, completed, title, loading } = todo;
  const { setSelectedTodo } = setters;
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleFild = useRef<HTMLInputElement>(null);
  const todoIsSelected = selectedTodo && selectedTodo.id === todo.id;

  useEffect(() => {
    if (titleFild.current && selectedTodo) {
      titleFild.current.focus();
    }
  }, [selectedTodo]);

  const onUpdate = () => {
    item.handleUpdate(todo, newTitle, setters);
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onUpdate();
  }

  const onEscape = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setSelectedTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
      onKeyUp={onEscape}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status completed"
          checked={completed}
          onChange={() => {
            handleUpdate(todo, !completed, setters);
          }}
        />
      </label>

      {todoIsSelected ? (
        <form onSubmit={onSubmit} onBlur={() => onUpdate()}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => item.handleDelete(todo, setters)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
