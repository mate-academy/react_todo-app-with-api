/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { MutableRefObject } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  tempTodo: Todo | undefined;
  todoForDelete: number[];
  setFocusForm: (isFocused: boolean) => void;
  handleToggle: (todo: Todo | undefined) => void;
  getFilteredTodos: Todo[];
  renaming: Todo | undefined;
  setNewTitle: (newTitle: string) => void;
  newTitle: string;
  loading: boolean;
  handleRename: (event?: React.FormEvent<HTMLFormElement>) => void;
  setRenaming: (todo: Todo | undefined) => void;
  handleDelete: (id: number | undefined) => void;
  formRef: MutableRefObject<HTMLInputElement | null>;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  todoForDelete,
  setFocusForm,
  getFilteredTodos,
  renaming,
  handleToggle,
  handleRename,
  setNewTitle,
  newTitle,
  loading,
  handleDelete,
  formRef,
  setRenaming,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {getFilteredTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            key={todo.id}
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
            {renaming && renaming.id === todo.id ? (
              <form
                onSubmit={e => handleRename(e)}
                onBlur={e => handleRename(e)}
              >
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

            {!renaming && (
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
      })}

      {tempTodo && (
        <div
          data-cy="Todo"
          key={tempTodo.id}
          className={classNames('todo', { completed: tempTodo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className={'modal overlay is-active'}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
