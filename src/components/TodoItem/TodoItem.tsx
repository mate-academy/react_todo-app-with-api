import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { patchTodo, removeTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  isAdding: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  toLoad:() => Promise<void>
  isDeletedComplete: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  onSetIsError,
  onSetTypeError,
  toLoad,
  isDeletedComplete,
}) => {
  const { title, completed } = todo;
  const [isDeleted, setIsdeleted] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isInputEditOpen, setIsInputEditOpen] = useState(false);
  const [titleInputEdit, setTitleInputEdit] = useState(title);

  const deleteTodo = async (id: number) => {
    try {
      setIsdeleted(true);
      await removeTodo(id);
    } catch (inError) {
      onSetIsError(false);
      onSetTypeError(Errors.ErrDEL);
    }

    toLoad();
    setIsdeleted(false);
  };

  const updateTodo = async (id: number, data: Partial<Todo>) => {
    try {
      setIsUpdated(true);
      await patchTodo(id, data);
    } catch (inError) {
      onSetTypeError(Errors.ErrUPD);
    }

    setIsUpdated(false);
    toLoad();
  };

  const handleClick = (id: number, isCompleted: boolean) => {
    const toUpdate = {
      completed: !isCompleted,
    };

    updateTodo(id, toUpdate);
  };

  const handleOpenInputEdit = () => {
    setIsInputEditOpen(true);
  };

  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInputEditOpen) {
      inputElement.current?.focus();
    }
  }, [isInputEditOpen]);

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleInputEdit(todo.title);
      setIsInputEditOpen(false);
    }
  };

  const handleCloseInputEdit = (id: number) => {
    if (!titleInputEdit) {
      deleteTodo(id);
      setIsInputEditOpen(false);

      return;
    }

    if (todo.title !== titleInputEdit) {
      updateTodo(id, { title: titleInputEdit });
      setIsInputEditOpen(false);
    }
  };

  const handleSubmitFormInput = (event: React.FormEvent, id: number) => {
    event.preventDefault();

    if (!titleInputEdit) {
      deleteTodo(id);
      setIsInputEditOpen(false);

      return;
    }

    if (todo.title !== titleInputEdit) {
      updateTodo(id, { title: titleInputEdit });
      setIsInputEditOpen(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => handleClick(todo.id, todo.completed)}
        />
      </label>

      {!isInputEditOpen
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleOpenInputEdit}
            >
              {title}
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
        ) : (
          <form onSubmit={(e) => handleSubmitFormInput(e, todo.id)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={titleInputEdit}
              ref={inputElement}
              onChange={event => setTitleInputEdit(event.target.value)}
              onBlur={() => handleCloseInputEdit(todo.id)}
              onKeyDown={handleEscape}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isAdding
            || isDeleted
            || isDeletedComplete
            || isUpdated,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
