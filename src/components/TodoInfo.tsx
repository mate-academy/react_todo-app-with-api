/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { removeTodo, updateTodo } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import { NewTodoField } from './NewTodoField';

type Props = {
  todo: Todo,
  loadTodos: () => void,
  addTodoToLoadingList: (idToAdd: number) => void,
  deleteTodoOfLoadingList: (idToAdd: number) => void,
  loadingList: number[],
  errorInfo: (errorTitle: ErrorTypes) => void,
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    loadTodos,
    addTodoToLoadingList,
    deleteTodoOfLoadingList,
    loadingList,
    errorInfo,
  },
) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const onDeleteTodo = useCallback(async () => {
    addTodoToLoadingList(id);

    try {
      await removeTodo(id);
      await loadTodos();
    } catch {
      errorInfo(ErrorTypes.DELETE);
    }

    deleteTodoOfLoadingList(id);
  }, []);

  const onUpdateStatusTodo = useCallback(async () => {
    addTodoToLoadingList(id);

    try {
      await updateTodo(id, title, !completed);
      await loadTodos();
    } catch {
      errorInfo(ErrorTypes.UPDATE);
    }

    deleteTodoOfLoadingList(id);
  }, [completed]);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      if (event.detail === 2) {
        setIsEditing(true);
      }
    }, [],
  );

  const onUpdateTodoTitle = useCallback(async () => {
    if (newTitle.trim().length === 0) {
      setIsEditing(false);
      onDeleteTodo();

      return;
    }

    if (title === newTitle) {
      setIsEditing(false);

      return;
    }

    setIsEditing(false);

    addTodoToLoadingList(id);

    try {
      await updateTodo(id, newTitle, completed);
      await loadTodos();
    } catch {
      errorInfo(ErrorTypes.UPDATE);
    }

    deleteTodoOfLoadingList(id);
  }, [newTitle, title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={onUpdateStatusTodo}
        />
      </label>

      {isEditing
        ? (
          <NewTodoField
            title={newTitle}
            changeTitle={setNewTitle}
            onSubmit={onUpdateTodoTitle}
            onSetIsEditing={setIsEditing}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={onDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingList.includes(id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
