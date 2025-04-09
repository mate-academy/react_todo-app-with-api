/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  renaming: Todo | undefined;
  handleToggle: (todo: Todo | undefined) => void;
  handleRename: (event?: React.FormEvent<HTMLFormElement>) => void;
  setNewTitle: (newTitle: string) => void;
  newTitle: string;
  setFocusForm: (isFocused: boolean) => void;
  setRenaming: (todo: Todo | undefined) => void;
  handleDelete: (id: number | undefined) => void;
  loading: boolean;
  todoForDelete: number[];
  formRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  renaming,
  handleToggle,
  handleRename,
  setNewTitle,
  newTitle,
  setFocusForm,
  setRenaming,
  handleDelete,
  loading,
  todoForDelete,
  formRef,
}) => {
  const isRenaming = renaming?.id === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggle(todo)}
        />
      </label>

      {isRenaming ? (
        <form onSubmit={e => handleRename(e)} onBlur={e => handleRename(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={formRef}
            onBlur={() => setFocusForm(false)}
            onFocus={() => {
              setFocusForm(true);
              setNewTitle(todo.title);
            }}
            className="todoapp__new-todo todoapp__renaming"
            onChange={e => setNewTitle(e.target.value)}
            value={newTitle}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setFocusForm(true);
            setRenaming(todo);
          }}
        >
          {todo.title}
        </span>
      )}

      {!isRenaming && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading || todoForDelete.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
