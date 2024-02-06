import {
  ChangeEvent, KeyboardEvent, useEffect, useRef, useState,
} from 'react';
/* eslint-disable quote-props */
import classNames from 'classnames';
import { Todo } from '../../types';
import { useTodos } from '../../context';

type Props = {
  todo: Todo,
};

export const TodoItem = ({ todo }: Props) => {
  const { completed, title, id } = todo;

  const [newtitle, setNewTitle] = useState<string | undefined>(title);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const {
    deleteTodoFromServer,
    updateTodoOnServer,
    loadingTodos,
    errors,
  } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isUpdating) {
      inputRef.current.focus();
    }
  }, [isUpdating, errors]);

  const handleDelete = (todoId: number) => () => {
    deleteTodoFromServer(todoId);
  };

  const handleChangeStatus = (status: boolean) => () => {
    if (id) {
      updateTodoOnServer(id, { completed: status });
    }
  };

  const handleUpdateTitle = () => {
    setIsUpdating(true);
    inputRef.current?.focus();
  };

  const handleChangeTitle = (event : ChangeEvent<HTMLInputElement>) => {
    const titleFromInput = event.target.value;

    setNewTitle(titleFromInput);
  };

  const isEmpty = !newtitle?.trim();
  const noChanges = (newtitle === title) && !isEmpty;
  const isDirty = !isEmpty && !noChanges;

  const onUpdate = () => {
    if (isEmpty) {
      deleteTodoFromServer(id);

      return;
    }

    if (noChanges) {
      setIsUpdating(false);

      return;
    }

    if (isDirty) {
      updateTodoOnServer(id, { title: newtitle });
      setIsUpdating(false);
    }
  };

  const handleUpdateOnBlur = () => {
    onUpdate();
  };

  const handleUpdategOnKey = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        onUpdate();
        break;
      case 'Escape':
        setIsUpdating(false);
        setNewTitle(title);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const isloadingTodos = loadingTodos.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        'completed': completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            'checked': completed,
          })}
          defaultChecked={completed}
          onClick={handleChangeStatus(!completed)}
        />
      </label>

      {isUpdating
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputRef}
              value={newtitle}
              disabled={isloadingTodos}
              onChange={handleChangeTitle}
              onBlur={handleUpdateOnBlur}
              onKeyUp={handleUpdategOnKey}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleUpdateTitle}
            >
              {newtitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isloadingTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
