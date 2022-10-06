import classNames from 'classnames';
import { MouseEvent, useState } from 'react';
import {
  deleteTodo,
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
  const { id, title, completed } = todo;
  const [isDoublClick, setIsDublClick] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const onHendleDeleteTodo = (deleteId: number) => {
    onDeleteTodo(deleteId);
    deleteTodo(deleteId);
  };

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

  const onTitleSubmit = async (event: EventChangeTitle = null) => {
    if (event) {
      event.preventDefault();
    }

    setIsDublClick(false);
    setloadingTodoId(id);

    if (!newTitle.trim()) {
      onHendleDeleteTodo(id);
      setloadingTodoId(null);

      return;
    }

    try {
      await updatingTodoTitle(id, newTitle);
      changeTitle(id, newTitle);
    } catch {
      setErrorMessage('update todo');
    } finally {
      setloadingTodoId(null);
    }
  };

  const isEscape = (key: string) => {
    if (key === 'Escape') {
      onTitleSubmit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
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
            onSubmit={onTitleSubmit}
          >
            <input
              type="text"
              className="todo__form"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={onTitleSubmit}
              onKeyDown={event => isEscape(event.key)}
            />
          </form>
        )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onHendleDeleteTodo(id)}
      >
        ×
      </button>

      {loadingTodoId === id && (
        <Loader />
      )}
    </div>
  );
};
