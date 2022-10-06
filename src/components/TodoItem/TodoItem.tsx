import classNames from 'classnames';
import { MouseEvent, useState } from 'react';
import {
  updatingTodoTitle,
  updatingTodoCompleted,
} from '../../api/todos';
import { Loader } from '../Loader/Loader';
import { EventChangeTitle, Props } from './TodoIremsPropTypes';

export const TodoItem : React.FC<Props> = ({
  todo,
  onDeleteTodo,
  toggleStatus,
  setloadingTodoId,
  setErrorMessage,
  loadingTodoId,
  changeTitle,
}) => {
  const [isDoublClick, setIsDublClick] = useState(false);
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const toggleStatusOnServer = async (
    selectedId: number,
    currentStatus: boolean,
  ) => {
    setloadingTodoId(selectedId);

    try {
      await updatingTodoCompleted(selectedId, !currentStatus);
      toggleStatus(selectedId, currentStatus);
    } catch {
      setErrorMessage('update todo');
    } finally {
      setloadingTodoId(null);
    }
  };

  const handleClick = (event : MouseEvent) => {
    if (event.detail === 2) {
      setIsDublClick(true);
    }
  };

  const onTitleSubmit = async (
    event: EventChangeTitle = null,
    todoId: number,
  ) => {
    if (event) {
      event.preventDefault();
    }

    setIsDublClick(false);
    setloadingTodoId(todoId);

    if (!newTitle.trim()) {
      onDeleteTodo(todoId);
      setloadingTodoId(null);

      return;
    }

    try {
      await updatingTodoTitle(todoId, newTitle);
      changeTitle(todoId, newTitle);
    } catch {
      setErrorMessage('update todo');
    } finally {
      setloadingTodoId(null);
    }
  };

  const isEscape = (key: string, todoId: number) => {
    if (key === 'Escape') {
      onTitleSubmit(undefined, todoId);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleStatusOnServer(id, completed)}
        />
      </label>
      {!isDoublClick
        ? (
          <span
            role="presentation"
            data-cy="TodoTitle"
            onClick={(event) => handleClick(event)}
            className="todo__title"
          >
            {newTitle}
          </span>
        )
        : (
          <form
            onSubmit={(event) => onTitleSubmit(event, id)}
          >
            <input
              type="text"
              className="todo__form"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={(event) => onTitleSubmit(event, id)}
              onKeyDown={event => isEscape(event.key, id)}
            />
          </form>
        )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      {loadingTodoId === id && (
        <Loader />
      )}
    </div>
  );
};
