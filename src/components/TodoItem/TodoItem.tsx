/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';

import React, { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../context/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [inProcessDeleting, setInProcessDeleting] = useState(false);
  const [inProcessToggling, setInProcessTogling] = useState(false);
  const [inProcessEdit, setInProcessEdit] = useState(false);
  const [updateField, setUpdateField] = useState(todo.title || '');
  const [firstTitle, setFirstTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const {
    onDeleteTodo,
    toggleStatus,
    togglingLoading,
    loadedId,
    updateTodo,
    areClearing,
  } = useContext(TodosContext);

  useEffect(() => {
    setFirstTitle(todo.title || '');
    setUpdateField(todo.title || '');
  }, [todo]);

  const isLoad = loadedId.includes(todo.id);

  const onToggleTodo = () => {
    setInProcessTogling(true);
    toggleStatus(todo.id).finally(() => {
      setInProcessTogling(false);
    });
  };

  const onRemoveTodo = () => {
    setInProcessDeleting(true);
    onDeleteTodo(todo.id);
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdateField(firstTitle);
    }

    if (event.key === 'Enter') {
      setIsEditing(false);

      if (updateField.length === 0) {
        onDeleteTodo(todo.id);
      }
    }
  };

  const onEditTodo = (event: React.FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault();

    setInProcessEdit(true);

    updateTodo(id, updateField).finally(() => setInProcessEdit(false));
  };

  const loadCondition
    = (areClearing && todo.completed)
    || inProcessDeleting
    || inProcessToggling
    || togglingLoading
    || isLoad
    || inProcessEdit;

  return (
    <div
      onKeyUp={onKeyUp}
      className={classNames({ todo: true, completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          onChange={onToggleTodo}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={(event) => onEditTodo(event, todo.id)}>
          <input
            type="text"
            className="todo__title-field"
            value={updateField}
            onChange={(event) => setUpdateField(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span onClick={onDoubleClick} className="todo__title">
            {todo.title}
          </span>
          <button
            onClick={() => onRemoveTodo()}
            type="button"
            className="todo__remove"
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames({
          'modal overlay': true,
          'is-active': loadCondition,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
