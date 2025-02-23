/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { ErrorMessage } from '../../types/ErrorMessages';
import * as TodoClient from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onEdit: (valau: boolean) => void;
};

export const TodoEditForm: React.FC<Props> = ({ todo, onEdit }) => {
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const { deleteTodo, updateTodo, handleSetErrorMessage } =
    useContext(TodoContext);

  const editTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editTodoInput.current?.focus();
  }, []);

  const handleEditTodo = () => {
    handleSetErrorMessage(ErrorMessage.None);
    setIsLoading(true);

    if (newTitle.trim() === title) {
      onEdit(false);

      return;
    }

    if (!newTitle.trim()) {
      TodoClient.deleteTodo(id)
        .then(() => {
          deleteTodo(id);
          onEdit(false);
        })
        .catch(() => {
          editTodoInput.current?.focus();
          handleSetErrorMessage(ErrorMessage.Delete);
        })
        .finally(() => setIsLoading(false));

      return;
    }

    TodoClient.updateTodo({ id, title: newTitle.trim(), completed })
      .then(() => {
        updateTodo({ id, title: newTitle.trim(), completed });
        onEdit(false);
      })
      .catch(() => {
        editTodoInput.current?.focus();
        handleSetErrorMessage(ErrorMessage.Update);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditTodo();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEdit(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={editTodoInput}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
