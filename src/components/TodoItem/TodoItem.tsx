import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todoId: number;
  completed: boolean;
  title: string;
  updateTodolist: React.Dispatch<React.SetStateAction<Todo[]>>;
  onError: React.Dispatch<React.SetStateAction<string>>;
  todoList: Todo[];
  processedIds: number[];
  updateProcessedIds: React.Dispatch<React.SetStateAction<number[]>>;
};
export const TodoItem: React.FC<Props> = ({
  todoId,
  completed,
  title,
  updateTodolist,
  onError,
  todoList,
  processedIds,
  updateProcessedIds,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [updatingTitle, setUpdatingTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteOneTodo = useCallback(
    (id: number) => {
      updateProcessedIds(existing => [...existing, id]);
      deleteTodo(id)
        .then(() => {
          updateTodolist(existing =>
            existing.filter(current => current.id !== id),
          );
        })
        .catch(() => onError('Unable to delete a todo'))
        .finally(() => {
          updateProcessedIds([]);
        });
    },
    [todoId],
  );

  const handleTitleUpdate = useCallback(
    (id: number, e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      const normalizeNewTitle = newTitle.trim();
      const isTitleChanged = title !== normalizeNewTitle;

      if (!normalizeNewTitle) {
        handleDeleteOneTodo(id);

        return;
      }

      if (!isTitleChanged) {
        setUpdatingTitle(false);

        return;
      }

      const changeItem = todoList.find(todo => todo.id === id);
      const toUpdate = { title: normalizeNewTitle };

      if (changeItem) {
        updateProcessedIds(existing => [...existing, id]);
        updateTodo(id, toUpdate)
          .then(() => {
            updateTodolist(existing =>
              existing.map(el =>
                el.id === id ? { ...el, title: toUpdate.title } : el,
              ),
            );
            setUpdatingTitle(false);
          })
          .catch(() => onError('Unable to update a todo'))
          .finally(() => {
            updateProcessedIds([]);
          });
      }
    },
    [newTitle],
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setUpdatingTitle(false);

        return;
      }
    },
    [],
  );

  const handleStatusUpdate = useCallback(
    (id: number) => {
      updateProcessedIds(existing => [...existing, id]);

      const changeItem = todoList.find(todo => todo.id === id);

      if (changeItem) {
        const toUpdate = { completed: !changeItem.completed };

        updateTodo(id, toUpdate)
          .then(() => {
            updateTodolist(existing =>
              existing.map(el =>
                el.id === id ? { ...el, completed: toUpdate.completed } : el,
              ),
            );
          })
          .catch(() => onError('Unable to update a todo'))
          .finally(() => {
            updateProcessedIds([]);
          });
      }
    },
    [completed],
  );

  useEffect(() => {
    if (updatingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleStatusUpdate(todoId)}
        />
      </label>
      {updatingTitle ? (
        <form onSubmit={event => handleTitleUpdate(todoId, event)}>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onBlur={() => handleTitleUpdate(todoId)}
            onKeyUp={event => handleKeyUp(event)}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setUpdatingTitle(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteOneTodo(todoId)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedIds.includes(todoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
