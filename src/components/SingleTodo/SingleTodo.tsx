import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  activeTodoId: number[];
  remove: (id: number[]) => void;
  toggle: (todo: Todo[]) => void;
  update: (todo: Todo) => void;
};

export const SingleTodo = React.memo<Props>(({
  todo,
  activeTodoId,
  remove,
  toggle,
  update,
}) => {
  const { title, completed, id } = todo;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(title);

  const handleDoubleClick = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (updatedTitle === title) {
      setIsFocused(false);

      return;
    }

    if (!updatedTitle) {
      remove([id]);
    } else {
      const newtodo = {
        ...todo,
        title: updatedTitle,
      };

      update(newtodo);
    }

    setIsFocused(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleBlur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== 'Escape') {
      return;
    }

    setIsFocused(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const todoToUpdate = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoToUpdate.current) {
      todoToUpdate.current.focus();
    }
  }, [isFocused]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggle([todo])}
        />
      </label>

      {!isFocused ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => remove([id])}
          >
            ×
          </button>
        </>
      )
        : (
          <form onSubmit={(event) => handleSubmit(event)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              ref={todoToUpdate}
              onChange={(event) => handleChange(event)}
              onBlur={handleBlur}
              onKeyDown={(event) => handleKeyDown(event)}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': activeTodoId.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
