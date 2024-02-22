import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorsMessage } from '../types/ErrorsMessage';
import * as TodoClient from '../api/todos';

type Props = {
  todo: Todo;
  onEdit: (value: boolean) => void;
};

export const TodoEdit: React.FC<Props> = ({ todo, onEdit }) => {
  const { id, title, completed } = todo;
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const { deleteTodo, updateTodo, handleSetErrorMessage } =
    useContext(TodoContext);

  const editTodoInput = useRef<HTMLInputElement>(null);

  const handleEditTodo = () => {
    handleSetErrorMessage(ErrorsMessage.None);
    setIsLoading(true);

    if (updatedTitle.trim() === title) {
      onEdit(false);

      return;
    }

    if (!updatedTitle.trim()) {
      TodoClient.deleteTodo(id)
        .then(() => {
          deleteTodo(id);
          onEdit(false);
        })
        .catch(() => {
          editTodoInput.current?.focus();
          handleSetErrorMessage(ErrorsMessage.Delete);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    TodoClient.updateTodo({ id, title: updatedTitle.trim(), completed })
      .then(() => {
        updateTodo({ id, title: updatedTitle.trim(), completed });
        onEdit(false);
      })
      .catch(() => {
        editTodoInput.current?.focus();
        handleSetErrorMessage(ErrorsMessage.Update);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditTodo();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEdit(false);
    }
  };

  const handleSetUpdatedTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdatedTitle(event.target.value);
  };

  useEffect(() => {
    editTodoInput.current?.focus();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={editTodoInput}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={updatedTitle}
          onChange={event => handleSetUpdatedTitle(event)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
