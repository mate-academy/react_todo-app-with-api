import React, { useState, FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  addingNewTodo: boolean;
  deletingCompletedTodos: boolean;
  onSetErrorMessage: (message: string) => void;
  getTodosFromApi: () => void;
};

export const TodoInfo: FC<Props> = ({
  todo,
  onDeleteTodo,
  addingNewTodo,
  deletingCompletedTodos,
  onSetErrorMessage,
  getTodosFromApi,
}) => {
  const { id, completed, title } = todo;
  const [deletingTodo, setDeletingTodo] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [newTitleInput, setNewTitleInput] = useState(title);

  const handleDeleteTodo = () => {
    setDeletingTodo(true);
    onDeleteTodo(id);
  };

  const handleChangeStatus = async () => {
    setIsChangingStatus(true);
    try {
      await updateTodo({
        ...todo,
        completed: !completed,
      }, id);
      getTodosFromApi();
    } catch {
      onSetErrorMessage('Unable to update a todo');
    }

    setIsChangingStatus(false);
  };

  const handleChangeTitle = async (newTitle: string) => {
    setIsChangingStatus(true);
    if (newTitle === '') {
      try {
        await deleteTodo(id);
        await getTodosFromApi();
      } catch {
        onSetErrorMessage('Unable to update a todo');
      }
    } else {
      try {
        await updateTodo({
          ...todo,
          title: newTitle,
        }, id);
        await getTodosFromApi();
      } catch {
        onSetErrorMessage('Unable to update a todo');
      }
    }

    setIsChangingStatus(false);
  };

  const handleOnBlure = () => {
    setIsChangingTitle(false);
    handleChangeTitle(newTitleInput);
  };

  const handleOnKeysDown = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      setIsChangingTitle(false);
    }

    if (key.code === 'Enter') {
      handleOnBlure();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', {
          completed,
        },
      )}
      onDoubleClick={() => setIsChangingTitle(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleChangeStatus}
        />
      </label>

      {isChangingTitle
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
              value={newTitleInput}
              onChange={(event) => setNewTitleInput(event.target.value)}
              onBlur={handleOnBlure}
              onKeyDown={handleOnKeysDown}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': addingNewTodo
              || deletingTodo
              || (todo.completed && deletingCompletedTodos)
              || isChangingStatus,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
