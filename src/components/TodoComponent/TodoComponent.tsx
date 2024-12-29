/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todoChangedTitle: Todo | null;
  inputEditRef: React.RefObject<HTMLInputElement> | null;
  loadingTodoIds: number[];
  onDoubleClickTodo: (todo: Todo) => void;
  onCompletedTodo: (todo: Todo) => void;
  onSubmitEdit: (
    titleEdit: string,
    event: React.FormEvent<HTMLFormElement> | null,
  ) => Promise<void>;
  handleBlurEdit: (titleEdit: string) => void;
  onDeleteTodo: (todoId: number | null) => void;
};

export const TodoComponent: React.FC<Props> = (props: Props) => {
  const {
    onDoubleClickTodo,
    todo,
    onCompletedTodo,
    todoChangedTitle,
    onSubmitEdit,
    inputEditRef,
    handleBlurEdit,
    onDeleteTodo,
    loadingTodoIds,
  } = props;

  const [titleEdit, setTitleEdit] = useState('');

  const { id, completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={() => {
        onDoubleClickTodo(todo);
        setTitleEdit(title);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => {
            onCompletedTodo(todo);
          }}
        />
      </label>

      {todoChangedTitle?.id === id ? (
        <form onSubmit={event => onSubmitEdit(titleEdit, event)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputEditRef}
            value={titleEdit}
            onChange={event => setTitleEdit(event.target.value)}
            onBlur={() => handleBlurEdit(titleEdit)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDeleteTodo(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
