import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../contexts/TodoContext';
import { deleteTodoApi, updateTodoApi } from '../../api/todos';
import {
  UNABLE_TO_DELETE_ERROR,
  UNABLE_TO_UPDATE_ERROR,
} from '../../constants/errors';

type Props = {
  todo: Todo;
  setEditingMode: (value: boolean) => void;
};

export const EditForm: React.FC<Props> = ({ todo, setEditingMode }) => {
  const { id, title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const { updateTodoHandler, setErrorHandler, deleteTodoHandler } =
    useContext(TodoContext);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInput.current?.focus();
  }, []);

  const saveEdit = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setEditingMode(false);

      return;
    }

    setErrorHandler('');
    setIsLoading(true);

    if (!trimmedTitle) {
      deleteTodoApi(id)
        .then(() => {
          deleteTodoHandler(id);
          setEditingMode(false);
        })
        .catch(() => {
          editInput.current?.focus();
          setErrorHandler(UNABLE_TO_DELETE_ERROR);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    updateTodoApi(id, { title: trimmedTitle, completed })
      .then(() => {
        updateTodoHandler({ id, title: trimmedTitle, completed });
        setEditingMode(false);
      })
      .catch(() => {
        editInput.current?.focus();
        setErrorHandler(UNABLE_TO_UPDATE_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveEdit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveEdit();
    }

    if (event.key === 'Escape') {
      setEditingMode(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={editInput}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          onBlur={saveEdit}
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
