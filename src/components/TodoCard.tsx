import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodoStatus, updateTodoTitle } from '../api/todos';
import { ErrorsType } from '../types/ErrorsType';
import { normalizeTitle } from '../utils/normalizeTitle';
import { createError } from './Errors';

type Props = {
  todo: Todo,
  getTodosList: () => Promise<void>,
  setErrors: React.Dispatch<React.SetStateAction<ErrorsType[]>>,
  isLoadingTodos: number[],
  setIsLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoCard: React.FC<Props> = ({
  todo,
  getTodosList,
  setErrors,
  isLoadingTodos,
  setIsLoadingTodos,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isUpdateTitle, setIsUpdateTitle] = useState(false);

  const handlerTitleEnter = (event :React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const setLoadingTodo = useCallback((settedId: number) => {
    setIsLoadingTodos(currentLoadTodos => [
      ...currentLoadTodos,
      settedId,
    ]);
  }, []);

  const unsetLoadingTodo = useCallback((unsettedId: number) => {
    setIsLoadingTodos(currentLoadTodos => currentLoadTodos
      .filter(stillLoadId => stillLoadId !== unsettedId));
  }, []);

  const handlerDeleteTodo = async () => {
    setLoadingTodo(id);

    try {
      await deleteTodo(id);

      await getTodosList();
    } catch {
      createError(ErrorsType.Delete, setErrors);
    }

    unsetLoadingTodo(id);
  };

  const handlerSetStatusTodo = async (status: boolean) => {
    setLoadingTodo(id);

    try {
      await updateTodoStatus(id, status);

      await getTodosList();
    } catch {
      createError(ErrorsType.Update, setErrors);
    }

    unsetLoadingTodo(id);
  };

  const handlerFormSubmit = async () => {
    if (newTitle === title) {
      setIsUpdateTitle(false);

      return;
    }

    if (!normalizeTitle(newTitle)) {
      setIsUpdateTitle(false);

      handlerDeleteTodo();

      return;
    }

    setLoadingTodo(id);
    setIsUpdateTitle(false);

    try {
      await updateTodoTitle(id, newTitle);

      await getTodosList();
    } catch {
      createError(ErrorsType.Update, setErrors);
    }

    unsetLoadingTodo(id);
  };

  const shouldShowNewTitle = isLoadingTodos.includes(id)
    && newTitle !== title
    && newTitle.trim();

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handlerSetStatusTodo(completed)}
        />
      </label>

      {isUpdateTitle
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handlerFormSubmit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={(input) => input?.focus()}
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handlerTitleEnter}
              onBlur={() => handlerFormSubmit()}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  setIsUpdateTitle(false);
                  setNewTitle(title);
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsUpdateTitle(curr => !curr);
              }}
            >
              {shouldShowNewTitle
                ? newTitle
                : title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handlerDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoadingTodos.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
