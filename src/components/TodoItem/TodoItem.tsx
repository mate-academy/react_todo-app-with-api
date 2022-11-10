import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, fieldToChange: object) => Promise<void>;
  loadingTodosIds: number[];
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  editTodo,
  loadingTodosIds,
}) => {
  const [titleQuery, setTitleQuery] = useState(todo.title);
  const [isInputVisible, setIsInputVisible] = useState(false);

  const titleChangeInput = useRef<HTMLInputElement>(null);
  const { title, completed, id } = todo;

  const handleDelete = () => {
    removeTodo(id);
  };

  const handleTodoStatus = () => {
    editTodo(id, { completed: !completed });
  };

  useEffect(() => {
    if (titleChangeInput.current) {
      titleChangeInput.current.focus();
    }
  }, [isInputVisible]);

  const renameTodo = (newTitle: string) => {
    editTodo(id, { title: newTitle });
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  const onTitleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (titleQuery === title) {
      setIsInputVisible(false);
    }

    if (titleQuery.trim()) {
      renameTodo(titleQuery);
      setIsInputVisible(false);
    } else {
      setTitleQuery('deleting ...');
      removeTodo(id);
    }
  };

  const onPressEscapeKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isInputVisible) {
      setIsInputVisible(false);
    }
  };

  const handleOnBlur = () => {
    setIsInputVisible(false);
  };

  const loaderIsActive = loadingTodosIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoStatus}
        />
      </label>

      {isInputVisible ? (
        <form onSubmit={onTitleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleQuery}
            onChange={handleChangeTitle}
            onKeyDown={onPressEscapeKey}
            ref={titleChangeInput}
            onBlur={handleOnBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsInputVisible(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': loaderIsActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
