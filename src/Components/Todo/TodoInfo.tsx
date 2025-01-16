import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../Types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  toggleTodos: number[];
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void;
  setError: (newError: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  toggleTodos,
  setTodos,
  setError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputNewTitle = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState(todo.title);

  const { title, id, completed } = todo;

  useEffect(() => {
    setIsLoading(todo.id === 0 || toggleTodos.includes(todo.id));
  }, [toggleTodos, todo.id]);

  useEffect(() => {
    if (isEditing) {
      inputNewTitle.current?.focus();
    }
  }, [isEditing]);

  const changeCompleted = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(changedTodo => {
        setTodos(previous =>
          previous.map(t => (t.id === changedTodo.id ? changedTodo : t)),
        );
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const deleteCompleted = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(previous => previous.filter(t => t.id !== todo.id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const titleChange = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      deleteCompleted();

      return;
    }

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);

    updateTodo(todo.id, { title: normalizedTitle })
      .then(changedTodo => {
        setTodos(previous =>
          previous.map(t => (t.id === changedTodo.id ? changedTodo : t)),
        );
        setIsEditing(false);
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div data-cy="Todo" className={classNames('todo', { completed })}>
        <label className="todo__status-label" htmlFor={`todo-${id}`}>
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo-${id}`}
            checked={completed}
            onChange={changeCompleted}
            aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
          />
        </label>

        {isEditing ? (
          <form onSubmit={titleChange}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todoapp__edited-todo"
              onBlur={titleChange}
              onChange={e => setNewTitle(e.target.value)}
              onKeyUp={handleKeyUp}
              ref={inputNewTitle}
              value={newTitle}
            />
          </form>
        ) : (
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
              data-cy="TodoDelete"
              onClick={deleteCompleted}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
