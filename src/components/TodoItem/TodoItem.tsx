import React, { FormEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  handleToggleStatus: (todo: Todo) => void;
  handleRename: (todo: Todo) => void;
  loadingTodos: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  handleToggleStatus,
  handleRename,
  loadingTodos,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const isLoading = loadingTodos.includes(todo.id);

  useEffect(() => setIsChanging(false), [todo]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsChanging(false);

      return;
    }

    if (!trimmedNewTitle) {
      deleteTodo(todo.id);

      return;
    }

    handleRename({ ...todo, title: trimmedNewTitle });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleToggleStatus(todo)}
        />
      </label>

      {isChanging ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsChanging(false);
            }
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsChanging(true);
            setNewTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {!isChanging && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
