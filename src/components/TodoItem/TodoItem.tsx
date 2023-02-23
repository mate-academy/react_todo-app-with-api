import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  todosLoadingState: Todo[],
  onClickRemoveTodo: (todoId: Todo) => void,
  onUpdateTodo: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onClickRemoveTodo,
  todosLoadingState,
  onUpdateTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const onKeyUpCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setTodoTitle(todo.title);
    }
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimTodoTitle = todoTitle.trim();

    if (trimTodoTitle === todo.title) {
      setIsEditing(false);
      setTodoTitle(todo.title);

      return;
    }

    if (!trimTodoTitle) {
      onClickRemoveTodo(todo);

      return;
    }

    onUpdateTodo({
      ...todo,
      title: todoTitle,
    });
    setIsEditing(false);
  };

  const hasLoadingState = todosLoadingState
    .some(todoLoading => todoLoading.id === todo.id);
  const isLoading = todo.id === 0 || hasLoadingState;

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdateTodo({
            ...todo,
            completed: !todo.completed,
          })}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              ref={inputRef}
              value={todoTitle}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onChange={(event) => setTodoTitle(event.target.value)}
              onBlur={handleOnSubmit}
              onKeyUp={onKeyUpCancelEditing}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onClickRemoveTodo(todo)}
            >
              ×
            </button>
          </>
        )}
      <div
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
