import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

import { InputForm } from '../InputForm';

type Props = {
  todo: Todo;
  onTodoDelete?: (todoId: number) => void,
  deletingTodoId?: number | null;
  loadingTodosIds?: number[];
  onUpdateTodo?: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoListItem: React.FC<Props> = React.memo(({
  todo,
  onTodoDelete = () => true,
  loadingTodosIds,
  onUpdateTodo = () => true,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [query, setQuery] = useState(title);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFormOpen(false);
        setQuery(title);
      }
    };

    document.addEventListener('keyup', handleEscapePress);

    return () => {
      document.removeEventListener('keyup', handleEscapePress);
    };
  }, [isFormOpen]);

  const handleTodoDelete = async (todoId: number) => {
    setDeletingTodoId(todoId);
    await onTodoDelete(todoId);
    setDeletingTodoId(null);
  };

  const handleTitleChange = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      onTodoDelete(id);
    }

    if (trimmedQuery === title) {
      setIsFormOpen(false);

      return;
    }

    setIsFormOpen(false);
    onUpdateTodo(id, { title: query });
  };

  const handleBlur = () => {
    handleTitleChange();
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      onDoubleClick={() => setIsFormOpen(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo(id, { completed: !completed })}
          checked={completed}
        />
      </label>

      {isFormOpen
        ? (
          <InputForm
            query={query}
            inputRef={inputRef}
            onHandleTitleChange={handleTitleChange}
            onSetQuery={setQuery}
            onHandleBlur={handleBlur}
          />
        )
        : (
          <>
            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleTodoDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': id === 0
            || id === deletingTodoId
            || loadingTodosIds?.includes(id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
