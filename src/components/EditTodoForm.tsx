import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as TodoService from '../api/todos';

type Props = {
  todo: Todo;
  onEdit: (v: boolean) => void;
};

export const EditTodoForm: React.FC<Props> = ({ todo, onEdit }) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isLoading]);

  const {
    deleteTodo,
    updateTodo,
    handleSetErrorMessage,
    handleSetUpdatingIds,
  } = useContext(TodoContext);

  const handlerKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEdit(false);
    }
  };

  const handleTitleChange = () => {
    handleSetErrorMessage(Error.none);
    setIsLoading(true);

    if (newTitle.trim() === title) {
      onEdit(false);
    }

    if (!newTitle.trim()) {
      handleSetUpdatingIds(id);

      TodoService.deleteTodo(id)
        .then(() => {
          deleteTodo(id);
          onEdit(false);
        })
        .catch(() => handleSetErrorMessage(Error.deleteTodo))
        .finally(() => {
          handleSetUpdatingIds(null);
          setIsLoading(false);
        });

      return;
    }

    TodoService.updateTodo({ id, title: newTitle.trim(), completed })
      .then(() => {
        updateTodo({ id, title: newTitle.trim(), completed });
        onEdit(false);
      })
      .catch(() => handleSetErrorMessage(Error.updateTodo))
      .finally(() => {
        handleSetUpdatingIds(null);
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleChange();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={editInputRef}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onBlur={() => handleTitleChange()}
        onKeyUp={handlerKey}
      />

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div /* eslint-disable-next-line */
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </form>
  );
};
