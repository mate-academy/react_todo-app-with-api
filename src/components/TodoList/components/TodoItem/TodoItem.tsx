/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './todo.scss';
import { useContext } from 'react';
import { todosContext } from '../../../../Store';
import { TodoWithLoader } from '../../../../types/TodoWithLoader';
import { handleDelete } from '../../../../utils/handleDelete';
import { handleUpdate } from '../../../../utils/handleUpdate';
type Props = { todo: TodoWithLoader };

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [state, setters] = useContext(todosContext);
  const [title, setTitle] = useState(todo.title);
  const titleFild = useRef<HTMLInputElement>(null);
  const todoIsSelected =
    state.selectedTodo && state.selectedTodo.id === todo.id;

  useEffect(() => {
    if (titleFild.current && state.selectedTodo) {
      titleFild.current.focus();
    }
  }, [state.selectedTodo]);

  function onDelete() {
    setters.setErrorMessage('');
    handleDelete(todo, setters);
  }

  const onUpdate = () => {
    const newTitle = title.trim();

    if (newTitle === todo.title) {
      setters.setSelectedTodo(null);
    } else if (newTitle.length === 0) {
      onDelete();
    } else {
      handleUpdate(todo, todo.completed, setters, newTitle);
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onUpdate();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onKeyUp={e => {
        if (e.key === 'Escape') {
          setTitle(todo.title);
          setters.setSelectedTodo(null);
        }
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status completed"
          checked={todo.completed}
          onChange={() => {
            handleUpdate(todo, !todo.completed, setters);
          }}
        />
      </label>

      {todoIsSelected ? (
        <form onSubmit={handleSubmit} onBlur={() => onUpdate()}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setters.setSelectedTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
