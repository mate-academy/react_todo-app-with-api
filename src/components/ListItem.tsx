import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo, updateTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
  deleteItem: (todoId: number) => void,
  setMessageError: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
  handleUpdate: (todoToUpdate: Todo, title?: string) => void,
  isFetching?: boolean | undefined,
};

export const ListItem: React.FC<Props> = ({
  todo,
  deleteItem,
  setMessageError,
  setError,
  handleUpdate,
  isFetching,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputChange, setInputChange] = useState(todo.title);

  const deleteHandler = () => {
    setIsLoading(true);

    removeTodo(todo.id)
      .then(() => {
        deleteItem(todo.id);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
        setMessageError('Unable to delete todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateHandler = () => {
    setIsLoading(true);

    updateTodo(5760, todo)
      .then(() => {
        handleUpdate(todo);
      })
      .catch(() => {
        setIsLoading(false);
        setError(true);
        setMessageError('Unable to update todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateInput = () => {
    setIsLoading(true);

    updateTodo(5760, todo, inputChange)
      .then(() => {
        handleUpdate(todo, inputChange);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(true);
        setMessageError(`Unable to update todo: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEnterKey = () => {
    if (inputChange === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!inputChange) {
      deleteHandler();
      setIsEditing(false);

      return;
    }

    updateInput();
    setIsEditing(false);
  };

  const handleEscapeKey = () => {
    setIsEditing(false);
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEnterKey();
    }

    if (event.key === 'Escape') {
      handleEscapeKey();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        completed: todo.completed,
      })}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => {
            updateHandler();
          }}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="NewTodoField"
          type="text"
          className="todo__title-field"
          value={inputChange}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(event) => {
            setInputChange(event.currentTarget.value);
          }}
          onBlur={() => {
            setIsEditing(false);
            updateInput();
          }}
          onKeyUp={(event) => handleEditKeyUp(event)}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={deleteHandler}
      >
        ×
      </button>

      <Loader
        id={todo.id}
        isLoading={isLoading || isFetching}
      />

    </div>
  );
};
