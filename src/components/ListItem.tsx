import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo, updateTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
  deleteItem: (todoId: number) => void,
  setMessageError: React.Dispatch<React.SetStateAction<string>>,
  handleUpdate: (todoToUpdate: Todo, title?: string) => void,
  isFetching?: boolean | undefined,
};

export const ListItem: React.FC<Props> = ({
  todo,
  deleteItem,
  setMessageError,
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
        setMessageError('Unable to delete todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateHandler = (isChanged: boolean) => {
    if (inputChange === todo.title && isChanged) {
      setIsEditing(false);

      return;
    }

    if (!inputChange) {
      deleteHandler();
      setIsEditing(false);

      return;
    }

    setIsLoading(true);

    updateTodo(5760, todo, isChanged ? inputChange : undefined)
      .then(() => {
        handleUpdate(todo, isChanged ? inputChange : undefined);
      })
      .catch((error) => {
        setIsLoading(false);
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

    updateHandler(true);
    setIsEditing(false);
  };

  const handleEscapeKey = () => {
    setIsEditing(false);
    setInputChange(todo.title);
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
          onChange={() => updateHandler(false)}
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
            updateHandler(true);
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
