/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { Error } from '../../types/Error';

interface Props {
  todo: Todo;
  deleteTodo: (todoid: number) => void;
  TodoUpdate: (todo: Todo) => void;
  setErrorText: (error: Error) => void;
  loaderTodoId: number[] | null;
  setLoaderTodoId: (todosId: number[] | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  TodoUpdate,
  setErrorText,
  loaderTodoId,
  setLoaderTodoId,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [inputValue, setinputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputToggleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodoId === todo.id) {
      inputRef.current?.focus();
    }
  }, [selectedTodoId, todo.id]);

  useEffect(() => {
    if (inputToggleRef.current) {
      inputToggleRef.current.checked = todo.completed;
    }
  }, [todo.completed]);

  const handleOnBlueInput = () => {
    if (!inputValue.trim()) {
      deleteTodo(todo.id);
      setSelectedTodoId(null);
      setinputValue('');

      return;
    }

    if (inputValue === todo.title) {
      setSelectedTodoId(null);
      setinputValue('');

      return;
    }

    const upTodo = { ...todo };

    upTodo.title = inputValue;
    setLoaderTodoId([todo.id]);

    updateTodo(upTodo)
      .then(() => {
        TodoUpdate(upTodo);
      })
      .catch(() => {
        setErrorText(Error.Update);
      })
      .finally(() => {
        setLoaderTodoId(null);
        setinputValue('');
      });
  };

  const handlePressKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setSelectedTodoId(null);
      setinputValue('');
    }
  };

  const handleDoubleClick = () => {
    setSelectedTodoId(todo.id);
    setinputValue(todo.title);
  };

  const handleToggle = () => {
    const upTodo = { ...todo };

    upTodo.completed = !upTodo.completed;

    updateTodo(upTodo)
      .then(() => {
        TodoUpdate(upTodo);
      })
      .catch(() => {
        setErrorText(Error.Update);
      });
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
          ref={inputToggleRef}
          onClick={handleToggle}
        />
      </label>

      {selectedTodoId === todo.id ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleOnBlueInput();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={inputValue}
            onChange={(event) => setinputValue(event.target.value)}
            onBlur={handleOnBlueInput}
            onKeyDown={handlePressKey}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick()}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': loaderTodoId?.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
