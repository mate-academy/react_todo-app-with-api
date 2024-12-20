import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo, patchTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isActive?: boolean;
  setErrorMessage: (message: string) => void;
  removeDeletedTodo: (id: number) => void;
  refreshTodo: (newTodo: Todo) => void;
}

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, isActive, setErrorMessage, removeDeletedTodo, refreshTodo }) => {
    const [userAction, setUserAction] = useState(false);

    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(false);
    const [edit, setEdit] = useState(false);

    const [todoTitle, setTodoTitle] = useState(todo.title);

    const inputRef = useRef<HTMLInputElement>(null);

    // HOOK for update of TODO on the server and trigger refresh in browser
    useEffect(() => {
      if (userAction) {
        setLoading(true);
        setErrorMessage('');

        patchTodo({ ...todo, completed: currentStatus, title: todoTitle })
          .then(item => {
            refreshTodo(item);
            setEdit(false);
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => {
            setLoading(false);
            setUserAction(false); // remove userAction trigger until next user action
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userAction]);

    // TODO status toggle triggered by User action
    const toggleTodoStatus = () => {
      setCurrentStatus(!todo.completed);
      setUserAction(true);
    };

    // Handling deleting TODO on the server
    const handleDeleteEvent = (id: number) => {
      const deletePromise = deleteTodo(id);

      setLoading(true);

      deletePromise
        .then(() => removeDeletedTodo(id))
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setLoading(false);
        });
    };

    // LOGIC behind whether to UPDATE TODO's title, DELETE TODO on empty title or cancel edit
    const handleUpdateTitle = (title: string) => {
      const newTitle = title.trim();

      switch (newTitle) {
        case '': {
          handleDeleteEvent(todo.id);
          break;
        }

        case todo.title: {
          setEdit(false);
          break;
        }

        default: {
          setUserAction(true);
          setTodoTitle(newTitle);
        }
      }
    };

    // Handling completion of edit on Enter key
    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const inputElement = inputRef.current as HTMLInputElement;

        if (inputElement) {
          handleUpdateTitle(inputElement.value);
        }
      }
    };

    // Handling cancellation of edit on Escape key
    const onEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        const originalTitle = todo.title;

        handleUpdateTitle(originalTitle);
        setTodoTitle(originalTitle);
      }
    };

    // Handling edit input losing focus
    const onBlur = () => {
      if (inputRef.current) {
        handleUpdateTitle(inputRef.current.value);
      }
    };

    // Handling starting edit input on double click
    const handleDoubleClick = () => {
      if (!edit) {
        setEdit(true);
      }
    };

    return (
      <div
        data-cy="Todo"
        onDoubleClick={handleDoubleClick}
        className={cn('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        {/* TODO STATUS */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={toggleTodoStatus}
            checked={todo.completed}
          />
        </label>

        {/* TODO TITLE / EDIT TODO FIELD */}
        {edit ? (
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            className="todo__title-field"
            value={todoTitle}
            onChange={e => setTodoTitle(e.target.value)}
            onKeyDown={onEnter}
            onKeyUp={onEsc}
            onBlur={onBlur}
            autoFocus
          />
        ) : (
          <span data-cy="TodoTitle" className="todo__title">
            {todoTitle}
          </span>
        )}

        {/* DELETE TODO */}
        {!edit && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteEvent(todo.id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isActive || loading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
