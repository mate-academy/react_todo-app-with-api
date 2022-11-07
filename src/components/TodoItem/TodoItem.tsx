import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteHandler: ((todoId: number) => Promise<unknown>);
  completedIsRemoving?: boolean;
  toggleTodoStatus: (todoId: number, completed: boolean) => Promise<unknown>;
  todosStatusIsChanging?: boolean;
  toggleAllIsActive?: boolean;
  renameTodo: (todoId: number, title: string) => Promise<unknown>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteHandler,
  completedIsRemoving,
  toggleTodoStatus,
  todosStatusIsChanging,
  toggleAllIsActive,
  renameTodo,
}) => {
  const { completed, title, id } = todo;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [titleIsChanging, setTitleIsChanging] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const removeTodo = () => {
    setIsDeleting(true);
    deleteHandler(id).finally(() => setIsDeleting(false));
  };

  const changeStatus = () => {
    setIsChanging(true);
    toggleTodoStatus(id, !completed).finally(() => setIsChanging(false));
  };

  const changeTodoTitle = (newTodoTitle: string) => {
    setIsChanging(true);
    renameTodo(id, newTodoTitle).finally(() => setIsChanging(false));
  };

  const saveTitleChanges = () => {
    setTitleIsChanging(false);
    if (title === newTitle) {
      return;
    }

    if (!newTitle.trim()) {
      removeTodo();

      return;
    }

    changeTodoTitle(newTitle);
  };

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveTitleChanges();
  };

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const escapeHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleIsChanging(false);
      setNewTitle(title);
    }
  };

  const showRenameForm = () => setTitleIsChanging(true);

  useEffect(() => {
    if (completed && completedIsRemoving) {
      removeTodo();
    }
  }, [completedIsRemoving]);

  useEffect(() => {
    if (todosStatusIsChanging) {
      setIsChanging(true);
      toggleTodoStatus(id, !toggleAllIsActive)
        .finally(() => setIsChanging(false));
    }
  }, [todosStatusIsChanging]);

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
          defaultChecked={completed}
          onChange={changeStatus}
        />
      </label>

      {titleIsChanging ? (
        <form
          onBlur={saveTitleChanges}
          onSubmit={formSubmitHandler}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={newTitle}
            value={newTitle}
            onChange={changeTitleHandler}
            onKeyUp={escapeHandler}
          />
        </form>
      )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={showRenameForm}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={removeTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': id === 0 || isDeleting || isChanging },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
