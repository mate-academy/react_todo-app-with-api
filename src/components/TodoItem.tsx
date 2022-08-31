import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  removeOneTodo: (id: number) => void;
  hasUpdateError: (condition: boolean) => void;
  isRemoving: boolean;
  isRemovingAll: boolean;
  updateStateTodos: (todo: Todo) => void;
  isLoadingAll: boolean;
};

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const {
    todo,
    removeOneTodo,
    hasUpdateError,
    isRemoving,
    isRemovingAll,
    updateStateTodos,
    isLoadingAll,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [deletedItem, setDeletedItem] = useState(0);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [changedTodoValue, setChangedTodoValue] = useState(todo.title);

  const updateOneTodoCompleted = (item: Todo) => {
    setIsLoading(true);
    client.patch<Todo>(`/todos/${item.id}`, {
      completed: !item.completed,
    })
      .then(res => updateStateTodos(res))
      .catch(() => hasUpdateError(true))
      .finally(() => setIsLoading(false));
  };

  const updateOneTodoTitle = (item: Todo) => {
    setIsLoading(true);
    client.patch<Todo>(`/todos/${item.id}`, {
      title: changedTodoValue,
    })
      .then(res => {
        if (!res) {
          hasUpdateError(true);
        }
      })
      .catch(() => hasUpdateError(true))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeValueOfTodoWithEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter'
    && changedTodoValue !== ''
    && changedTodoValue !== todo.title) {
      updateOneTodoTitle(todo);
      setIsDoubleClicked(false);
    } else if ((event.key === 'Enter' && changedTodoValue !== '')
    || event.key === 'Escape') {
      setIsDoubleClicked(false);
    } else if ((event.key === 'Enter' && changedTodoValue === '')) {
      removeOneTodo(todo.id);
    }
  };

  const changeValueOfTodoWithBlur = () => {
    if (changedTodoValue !== ''
    && changedTodoValue !== todo.title) {
      updateOneTodoTitle(todo);
    } else if (changedTodoValue === '') {
      removeOneTodo(todo.id);
    }

    setIsDoubleClicked(false);
  };

  const updateTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (updateTodoField.current) {
      updateTodoField.current.focus();
    }
  }, [isDoubleClicked]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => updateOneTodoCompleted(todo)}
        />
      </label>

      {isDoubleClicked
        ? (
          <form
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              // placeholder={changedTodoValue}
              value={changedTodoValue}
              ref={updateTodoField}
              onChange={(event) => {
                setChangedTodoValue(event.target.value);
              }}
              onKeyDown={changeValueOfTodoWithEnter}
              onBlur={changeValueOfTodoWithBlur}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsDoubleClicked(true);
              }}
            >
              {changedTodoValue}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeOneTodo(todo.id);
                setDeletedItem(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      {((isLoading
        || (isRemoving && deletedItem === todo.id))
        || (isRemovingAll && todo.completed)
        || (isLoadingAll))
        && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
});
