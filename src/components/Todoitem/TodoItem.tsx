import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';

interface Props {
  todo: Todo | TempTodo
  onButtonRemove: (id: number) => void
  loadingTodoIds: number[]
  ToggleStatusCompleted: (id: number, status: boolean) => void
  updateTitle: (id: number, newTitle: string) => void
}

export const TodoItem: React.FC<Props> = React.memo(
  (
    {
      todo,
      onButtonRemove,
      loadingTodoIds,
      ToggleStatusCompleted,
      updateTitle,
    },
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTodoEdition, setIsTodoEdition] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const isLoading = todo.id === 0 || loadingTodoIds.includes(todo.id);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [isTodoEdition]);

    const saveNewTitle = () => {
      const newTitle = title.trim();

      setIsTodoEdition(false);

      if (newTitle === todo.title) {
        setIsTodoEdition(false);

        return;
      }

      if (newTitle) {
        updateTitle(todo.id, newTitle);
      } else {
        onButtonRemove(todo.id);
      }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      saveNewTitle();
    };

    const onEscape = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTodoEdition(false);
      }
    };

    return (
      <div
        className={cn(
          'todo',
          { completed: todo?.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo?.completed}
            onChange={() => ToggleStatusCompleted(todo.id, todo.completed)}
          />
        </label>
        {isTodoEdition
          ? (
            <form onSubmit={onSubmit}>
              <input
                data-cy="TodoTitleField"
                type="text"
                ref={inputRef}
                placeholder="This todo will be deleted"
                className="todo__title-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveNewTitle}
                onKeyUp={onEscape}
              />
            </form>
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => setIsTodoEdition(true)}
              >
                {todo?.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onButtonRemove(todo.id)}
              >
                ×
              </button>
            </>
          )}

        <div className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
        >
          <div
            className="modal-background has-background-white-ter"
          />

          <div className="loader" />
        </div>

      </div>
    );
  },
);
