/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { useState } from 'react';
import { removeTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { NewTodoField } from './NewTodoField';

type Props = {
  todo: Todo,
  loadTodos: () => void,
  onSetDeleteTodoError: (isError: boolean) => void,
  onSetUpdateTodoError: (isError: boolean) => void,
  addTodoToLoadingList: (idToAdd: number) => void,
  deleteTodoOfLoadingList: (idToAdd: number) => void,
  loadingList: number[],
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    loadTodos,
    onSetDeleteTodoError,
    onSetUpdateTodoError,
    addTodoToLoadingList,
    deleteTodoOfLoadingList,
    loadingList,
  },
) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);

  const [isEditing, setIsEditing] = useState(false);

  const onDeleteTodo = async () => {
    addTodoToLoadingList(id);

    try {
      await removeTodo(id);
      await loadTodos();
    } catch {
      onSetDeleteTodoError(true);
      setTimeout(() => {
        onSetDeleteTodoError(false);
      }, 3000);
    }

    deleteTodoOfLoadingList(id);
  };

  const onUpdateStatusTodo = async () => {
    addTodoToLoadingList(id);

    try {
      await updateTodo(id, title, !completed);
      await loadTodos();
    } catch {
      onSetUpdateTodoError(true);
      setTimeout(() => {
        onSetUpdateTodoError(false);
      }, 3000);
    }

    deleteTodoOfLoadingList(id);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.detail === 2) {
      setIsEditing(true);
    }
  };

  const onSubmit = async () => {
    if (title === newTitle) {
      setIsEditing(false);

      return;
    }

    addTodoToLoadingList(id);

    await updateTodo(id, newTitle, completed);
    await loadTodos();
    setIsEditing(false);

    deleteTodoOfLoadingList(id);
  };

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
            changeTitle={(value) => setNewTitle(value)}
            onSubmit={onSubmit}
            onSetIsEditing={(isEdit) => setIsEditing(isEdit)}
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
