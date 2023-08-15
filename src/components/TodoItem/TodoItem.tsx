/* eslint-disable */
import classNames from "classnames";

import React, { useContext, useEffect, useState } from "react";
import { Todo } from "../../types/Todo";
import { TodosContext } from "../../context/TodosContext";

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todosLoading, onDeleteTodo, toggleTodoStatus, updateTodo } =
    useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [updateField, setUpdateField] = useState(todo.title || "");
  const [firtTitle, setFirstTitle] = useState(todo.title);

  useEffect(() => {
    setFirstTitle(todo.title || "");
    setUpdateField(todo.title || "");
  }, [todo]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }

    if (event.key === "Escape") {
      setIsEditing(false);
      setUpdateField(firtTitle);

      return;
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!updateField) {
      onDeleteTodo(todo.id);

      return;
    }

    updateTodo(updateField, todo.id);
  };

  return (
    <div className={classNames({ todo: true, completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            value={updateField}
            onChange={(event) => setUpdateField(event.target.value)}
            type="text"
            className="todo__title-field"
            onKeyUp={handleKeyUp}
            onBlur={() => handleSubmit}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditing(true)}
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames({
          "modal overlay": true,
          "is-active": todosLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
