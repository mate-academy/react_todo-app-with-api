/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[],
  loadTodos: () => void,
  isAdding: boolean,
  title: string,
  user: User | null,
  addTodoToLoadingList: (idToAdd: number) => void,
  deleteTodoOfLoadingList: (idToAdd: number) => void,
  loadingList: number[],
};

export const TodoList: React.FC<Props> = (
  {
    visibleTodos,
    loadTodos,
    isAdding,
    title,
    user,
    addTodoToLoadingList,
    deleteTodoOfLoadingList,
    loadingList,
  },
) => {
  const [deleteTodoError, setDeleteTodoError] = useState(false);
  const [updateTodoError, setUpdateTodoError] = useState(false);

  const previewTodo: Todo = {
    id: 0,
    userId: user?.id || 0,
    title,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {deleteTodoError && (
        <div
          className={classNames(
            'notification', 'is-danger', 'is-light', 'none-visible', {
              hidden: !deleteTodoError,
            },
          )}
        >
          <span>Unable to delete a todo</span>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setDeleteTodoError(false)}
          />
        </div>
      )}

      {updateTodoError && (
        <div
          className={classNames(
            'notification', 'is-danger', 'is-light', 'none-visible', {
              hidden: !updateTodoError,
            },
          )}
        >
          <span>Unable to update a todo</span>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setUpdateTodoError(false)}
          />
        </div>
      )}

      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadTodos={loadTodos}
          onSetDeleteTodoError={(isError) => setDeleteTodoError(isError)}
          onSetUpdateTodoError={(isError) => setUpdateTodoError(isError)}
          addTodoToLoadingList={addTodoToLoadingList}
          deleteTodoOfLoadingList={deleteTodoOfLoadingList}
          loadingList={loadingList}
        />
      ))}
      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {previewTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className="modal overlay is-active todo__title-field"
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
