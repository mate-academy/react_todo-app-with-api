import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { updateTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  setTodos: (value: Todo[] | ((val: Todo[]) => Todo[])) => void,
  setErrorMessage: (value: Errors) => void,
  todos: Todo[],
  todo: Todo,
  loadingItemsId: number[] | null,
  onDelete: (value: number) => void,
  setLoadingItemId: (value: number | null) => void,
  loadingItemId: number | null,
}

export const TodoList: React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  todos,
  todo,
  loadingItemsId,
  onDelete,
  setLoadingItemId,
  loadingItemId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const newTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTitleRef.current) {
      newTitleRef.current.focus();
    }
  }, [isEditing]);

  const trimNewTitle = newTitle.trim();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (trimNewTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimNewTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimNewTitle !== todo.title) {
      setLoadingItemId(todo.id);

      updateTodos(todo.id, {
        userId: 11914,
        title: trimNewTitle,
        completed: todo.completed,
      })
        .then(() => {
          const currentTodo: Todo[] = todos.map(ctodo => {
            if (todo.id === ctodo.id) {
              return { ...ctodo, title: trimNewTitle };
            }

            setIsEditing(false);

            return ctodo;
          });

          setTodos(currentTodo);
        })
        .catch(() => setErrorMessage(Errors.UnableUpdate))
        .finally(() => {
          setLoadingItemId(null);
        });
    }
  };

  const handleChecked = (todoId: number) => {
    setLoadingItemId(todoId);

    updateTodos(todoId, {
      userId: 11914,
      title: todo.title,
      completed: !todo.completed,
    })
      .then(() => {
        const currentTodo: Todo[] = todos.map(currtodo => {
          if (todo.id === currtodo.id) {
            return { ...currtodo, completed: !currtodo.completed };
          }

          return currtodo;
        });

        setTodos(currentTodo);
      })
      .catch(() => setErrorMessage(Errors.UnableUpdate))
      .finally(() => setLoadingItemId(null));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChecked(todo.id)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              ref={newTitleRef}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={handleSubmit}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === loadingItemId
            || (loadingItemsId && loadingItemsId.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
