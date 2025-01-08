/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { LoadingTodo } from '../types/LoadingTodo';

interface Props {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (
    updateTodoItem: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  todoLoading: LoadingTodo;
}

export const TodoCard: React.FC<Props> = props => {
  const { todo, handleDeleteTodo, handleUpdateTodo, todoLoading } = props;

  const [hasLoading, setHasLoading] = useState(false);
  const [todoNewTitle, setTodoNewTitle] = useState(todo.title);
  const [hasEditing, sethasEditing] = useState(false);

  const todoTitleTask = useRef<HTMLInputElement>(null);
  const hasActiveTask =
    Object.hasOwn(todoLoading, todo.id) || hasLoading || todo.id === 0;

  useEffect(() => {
    if (todoTitleTask.current && hasEditing) {
      todoTitleTask.current.focus();
    }
  }, [hasEditing]);

  const onDelete = () => {
    setHasLoading(true);
    handleDeleteTodo(todo.id).finally(() => setHasLoading(false));
  };

  const onUpdateTodo = () => {
    setHasLoading(true);
    handleUpdateTodo(todo, 'completed', !todo.completed).finally(() =>
      setHasLoading(false),
    );
  };

  const onSubmitTodo = () => {
    if (todoNewTitle === todo.title) {
      setHasLoading(false);

      return;
    }

    if (!todoNewTitle.trim()) {
      onDelete();

      return;
    }

    setHasLoading(true);
    handleUpdateTodo(todo, 'title', todoNewTitle.trim())
      .then(char => sethasEditing(char))
      .finally(() => setHasLoading(false));
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      sethasEditing(false);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={onUpdateTodo}
          />
        </label>

        {hasEditing ? (
          <div onKeyUp={({ key }) => key === 'Escape' && sethasEditing(false)}>
            <form
              onSubmit={event => {
                event.preventDefault();
                onSubmitTodo();
              }}
            >
              <input
                data-cy="TodoFilterField"
                type="text"
                placeholder="Delete empty todo"
                ref={todoTitleTask}
                value={todoNewTitle}
                onChange={event => setTodoNewTitle(event.target.value)}
                onBlur={onSubmitTodo}
                onKeyUp={onKey}
                className="todo-title-field"
              />
            </form>
          </div>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => sethasEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': hasActiveTask,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
