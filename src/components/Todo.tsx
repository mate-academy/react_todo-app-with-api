/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { USER_ID } from '../api/todos';

type Props = {
  todo: Todo;
  activeTodos: Todo[];
  setActiveTodos: (todo: Todo[]) => void;
  onDelete: (todoId: number) => void;
  update: (todoToUpdate: Todo) => Promise<void>;
  errorFunction: (message: string) => void;
  loadingState: boolean;
};

export const ToDo: React.FC<Props> = ({
  todo,
  activeTodos,
  setActiveTodos,
  update,
  errorFunction,
  onDelete = () => {},
  loadingState,
}) => {
  const [onEdit, setOnEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [todoStatus, setTodoStatus] = useState(todo.completed);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const todoToUpdate: Todo = {
    id: todo.id,
    title: title.trim(),
    userId: USER_ID,
    completed: todoStatus,
  };

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onEdit && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [onEdit]);

  useEffect(() => {
    setTodoStatus(todo.completed);
  }, [todo]);

  const handleDelete = (todoToDelete: Todo) => {
    setActiveTodos([todo]);
    onDelete(todoToDelete.id);
  };

  const handleUpdate = () => {
    setOnEdit(false);

    update(todoToUpdate)
      .then(() => {})
      .catch(() => {
        errorFunction('Unable to update a todo');
        setOnEdit(true);
      });
  };

  const checkTitle = () => {
    const newTitle = todoToUpdate.title;

    if (newTitle.length === 0) {
      handleDelete(todo);
    } else if (newTitle === todo.title) {
      setTitle(newTitle);
      setOnEdit(false);
    } else {
      handleUpdate();
    }
  };

  const submitUpdate = (
    event: React.FormEvent<HTMLInputElement | HTMLFormElement>,
  ) => {
    event.preventDefault();
    checkTitle();
  };

  const setTodoStatusFunction = () => {
    if (todo.completed) {
      setTodoStatus(false);
    } else {
      setTodoStatus(true);
    }

    handleUpdate();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOnEdit(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => setOnEdit(true)}
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        htmlFor={`${todo.id}`}
        onClick={() => setTodoStatusFunction()}
        className="todo__status-label"
      >
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
        />
      </label>

      {!onEdit ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={event => submitUpdate(event)}>
          <input
            data-cy="TodoTitleField"
            ref={todoInputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => onInputChange(event)}
            onSubmit={event => submitUpdate(event)}
            onBlur={() => checkTitle()}
            onKeyUp={event => handleKeyUp(event)}
          />
        </form>
      )}

      <Loader
        loadingState={loadingState}
        todo={todo}
        activeTodos={activeTodos}
      />
    </div>
  );
};
