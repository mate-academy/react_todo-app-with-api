/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todo: Todo;
  allTodos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  loadingTodo: boolean;
  setErrorMessage: (arg: string) => void;
  setLoadingTodo: (arg: boolean) => void;
  loadingTodoId: number;
  setLoadingTodoId: (arg: number) => void;
  loadingForToggleAll: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, id, completed },
  allTodos,
  setAllTodos,
  loadingTodo,
  setErrorMessage,
  setLoadingTodo,
  loadingTodoId,
  setLoadingTodoId,
  loadingForToggleAll,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleDeleteButton = (todoId: number) => {
    setLoadingTodo(true);
    setLoadingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setAllTodos(allTodos.filter(todoItem => todoItem.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DeleteTodo);
      })
      .finally(() => {
        setLoadingTodo(false);
        setLoadingTodoId(-1);
      });
  };

  const handleSaveTitle = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle.length === 0) {
      handleDeleteButton(id);

      return;
    }

    if (trimmedTitle === title.trim()) {
      setIsEditing(false);

      return;
    }

    setLoadingTodo(true);
    setLoadingTodoId(id);
    if (editedTitle.trim().length === 0) {
      setErrorMessage(ErrorType.NoTitle);
      setLoadingTodo(false);

      return;
    }

    updateTodo(id, { title: trimmedTitle })
      .then((updatedTodo: Todo) => {
        setAllTodos(allTodos.map(t => (t.id === id ? updatedTodo : t)));

        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage(ErrorType.UpdateTodo);
      })
      .finally(() => setLoadingTodo(false));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleToggleTodo = async () => {
    setLoadingTodo(true);
    setLoadingTodoId(id);
    const newCompleted = !completed;

    try {
      await updateTodo(id, {
        completed: newCompleted,
      });

      setAllTodos(
        allTodos.map(t =>
          t.id === id ? { ...t, completed: newCompleted } : t,
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorType.UpdateTodo);
    } finally {
      setLoadingTodo(false);
      setLoadingTodoId(-1);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label" aria-label="toggle todo completion">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status')}
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleSaveTitle}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSaveTitle();
            }

            if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title.trim()}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteButton(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (loadingTodo && id === loadingTodoId) ||
            loadingForToggleAll.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
