import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
  changeTodoStatus: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  changeTodoStatus,
  changeTodoTitle,
}) => {
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [deletedTodo, setDeleteTodo] = useState(0);

  const submitingForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setDeleteTodo(todo.id);
      deleteTodo(todo.id);
    } else if (newTitle !== todo.title) {
      changeTodoTitle(todo.id, newTitle);
      setNewTitle(newTitle.trim());
      setIsDoubleClicked(false);
    }
  };

  const handleKeyboardEvent = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsDoubleClicked(true);
    }

    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => changeTodoStatus(todo)}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={submitingForm}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event => setNewTitle(event.target.value))}
              onKeyDown={handleKeyboardEvent}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsDoubleClicked(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === deletedTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
