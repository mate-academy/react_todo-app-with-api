/* eslint-disable jsx-a11y/no-autofocus */
import classNames from 'classnames';
import React, {
  ChangeEvent, useContext, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/TodoContext';

type Props = {
  todo: Todo,
  loader: boolean,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loader,
}) => {
  const {
    deleteTodo,
    handleUpdateTodo,
  } = useContext(TodoContext);

  const [editTitle, setEditTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const changeCompletedState = (e: ChangeEvent<HTMLInputElement>) => {
    const todoToCheck = {
      ...todo,
      completed: e.target.checked,
    };

    handleUpdateTodo(todoToCheck);
  };

  const handleTitleEdit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (todo.title === editTitle) {
      setIsEditing(false);

      return;
    }

    if (!editTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    const todoToUpdate = {
      ...todo,
      title: editTitle,
    };

    handleUpdateTodo(todoToUpdate);
    setIsEditing(false);
  };

  const cancelEditing = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={changeCompletedState}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleTitleEdit}>
          <input
            autoFocus
            type="text"
            className="todoapp__new-todo"
            onChange={(e) => setEditTitle(e.target.value)}
            defaultValue={todo.title}
            onBlur={handleTitleEdit}
            onKeyDown={cancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo?.title}
          </span>
          <button
            onClick={() => deleteTodo(todo.id)}
            type="button"
            className="todo__remove"
          >
            ×
          </button>
          <div className={classNames('modal overlay', {
            'is-active': loader,
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
