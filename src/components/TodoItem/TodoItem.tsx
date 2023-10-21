import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo, changeTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';
import { UseTodosContext } from '../../utils/TodosContext';
import { TodoUpdates } from '../../types/TodoUpdates';

const DEFAULT_ID = 0;

type Props = { todo: Todo };

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const context = UseTodosContext();
  const {
    setTodos,
    setErrorMessage,
    loadingTodos,
  } = context;

  const { title, completed, id } = todo;

  const [isEdited, setIsEdited] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(title);

  const isLoadingComponent = id === DEFAULT_ID;
  const [isLoading, setIsLoading] = useState(isLoadingComponent);

  const isGloballyTogling = loadingTodos.includes(id);

  // deleting todo
  const handleTodoDelete = (todoId: number) => {
    setTodos(prevState => prevState.filter(task => task.id !== todoId));
  };

  const removeTodo = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => handleTodoDelete(id))
      .catch(() => setErrorMessage(ErrorMessages.CannotDelete))
      .finally(() => setIsLoading(false));
  };

  // updating todo
  const updateTodo = (updatedTodo: Todo) => {
    setTodos(prevState => {
      return prevState.map(todoItem => {
        if (todoItem.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todoItem;
      });
    });
  };

  const handleTodoUpdate = (updates: TodoUpdates) => {
    const normalisedTodoTitle = editedTodoTitle.trim();

    if (!normalisedTodoTitle.length) {
      removeTodo();

      return;
    }

    setIsLoading(true);

    changeTodo(id, updates)
      .then((newTodo) => {
        updateTodo(newTodo);
        setIsEdited(false);
      })
      .catch(() => setErrorMessage(ErrorMessages.CannotUpdate))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCompletionStatusChange = () => {
    handleTodoUpdate({ completed: !completed });
  };

  // form events
  const changeTitle = () => {
    if (editedTodoTitle === title) {
      setIsEdited(false);

      return;
    }

    handleTodoUpdate({ title: editedTodoTitle.trim() });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeTitle();
  };

  const handleInputKeyout = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setEditedTodoTitle(title);
    }
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
          name="completed"
          type="checkbox"
          className="todo__status"
          onChange={handleCompletionStatusChange}
          checked={completed}
        />
      </label>
      {isEdited
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodoTitle}
              onBlur={changeTitle}
              onChange={(event) => setEditedTodoTitle(event.target.value)}
              onKeyUp={handleInputKeyout}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEdited(true)}
            >
              {title}
            </span>

            <button
              data-cy="TodoDelete"
              onClick={removeTodo}
              type="button"
              className="todo__remove"
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
          {
            'is-active': isLoading || isGloballyTogling,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
