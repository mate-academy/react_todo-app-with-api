import classNames from 'classnames';
import React, { useState } from 'react';
import { patchTodo } from '../../../api/todos';
import { Todo } from '../../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todo: Todo) => void;
  changedTodos: (todo: Todo) => void;
  setErrorMessage: (error: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, changedTodos, setErrorMessage,
}) => {
  const [onChangeTitle, setOnChangeTitle] = useState(true);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [cheked, setCheked] = useState(todo.completed);

  // eslint-disable-next-line max-len
  const handlerActiveChangedTitle = () => {
    setOnChangeTitle(false);
  };

  const handlerChangedTitle = () => {
    const newData = {
      ...todo,
      title: newTitle.length > 0 ? newTitle : todo.title,
      completed: cheked,
    };

    if (newTitle.length === 0) {
      deleteTodo(todo);
    } else {
      patchTodo(todo.id, newData).then(() => {
        setOnChangeTitle(true);
        changedTodos(newData);
      }).catch(() => setErrorMessage('Unable to update a todo'));
    }
  };

  const handlerChangedCheked = () => {
    setCheked((state) => !state);

    const newData = {
      ...todo,
      completed: !cheked,
    };

    patchTodo(todo.id, newData)
      .then(() => {
        changedTodos(newData);
      }).catch(() => setErrorMessage('Unable to update a todo'));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={cheked}
          onChange={() => {
            handlerChangedCheked();
          }}
        />
      </label>

      {onChangeTitle
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handlerActiveChangedTitle}
              role="button"
              tabIndex={0}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo)}
            >
              ×
            </button>
          </>
        ) : (
          <form onBlur={event => {
            event.preventDefault();
            handlerChangedTitle();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </form>
        )}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
