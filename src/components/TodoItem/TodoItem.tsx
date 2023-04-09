import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../../Loader';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  isToggleAll: boolean,
  handleUpdateTodoFormSubmit: (
    id: number,
    completed?: boolean,
    newTitle?: string,
  ) => void,
  isOnRender: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  isToggleAll,
  handleUpdateTodoFormSubmit,
  isOnRender,
}) => {
  const {
    title,
    id,
  } = todo;

  const [completed, setCompleted] = useState(todo.completed);
  const [updateTodoTitle, setUpdateTodoTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(title);
  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    setCompleted(todo.completed);
    setNewTodoTitle(title);
    setIsCancel(false);
  }, [todo.completed, title, isCancel]);

  const handleChenge = async (TodoId: number, todoCompleted: boolean) => {
    handleUpdateTodoFormSubmit(TodoId, !completed);

    if (isOnRender) {
      setCompleted(!todoCompleted);
    }
  };

  const handleDblClick = () => {
    setUpdateTodoTitle(true);
  };

  const saveNewUpdateTodoTitle = () => {
    if (newTodoTitle.length > 0) {
      setUpdateTodoTitle(false);
      setIsLoading(true);

      handleUpdateTodoFormSubmit(id, completed, newTodoTitle);
    } else {
      removeTodo(id);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveNewUpdateTodoTitle();

    setNewTodoTitle(title);
  };

  const cancelChanges = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsCancel(true);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [todo.completed, title]);

  const loadingContext = useContext(Loader);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      onDoubleClick={handleDblClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleChenge(id, todo.completed)}
        />
      </label>

      {updateTodoTitle ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onBlur={saveNewUpdateTodoTitle}
            onKeyUp={cancelChanges}
            // eslint-disable-next-line
            autoFocus
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          {
            'is-active': loadingContext.includes(id)
              || isToggleAll
              || isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
