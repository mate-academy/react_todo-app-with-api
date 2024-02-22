import { useContext, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoContext } from '../../contexts/TodoContext';
import { deleteTodoApi, updateTodoApi } from '../../api/todos';
import {
  UNABLE_TO_DELETE_ERROR,
  UNABLE_TO_UPDATE_ERROR,
} from '../../constants/errors';
import { EditForm } from '../EditForm/EditForm';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    updatingTodosIds,
    deleteTodoHandler,
    updateTodoHandler,
    setUpdatingTodosIdsHandler,
    setErrorHandler,
  } = useContext(TodoContext);

  const { id, title, completed } = todo;
  const [isEditingMode, setIsEditingMode] = useState(false);

  const toggleStatus = () => {
    setUpdatingTodosIdsHandler(id);
    setErrorHandler('');

    updateTodoApi(id, { title, completed })
      .then(() => updateTodoHandler({ id, title, completed: !completed }))
      .catch(() => {
        setErrorHandler(UNABLE_TO_UPDATE_ERROR);
      })
      .finally(() => setUpdatingTodosIdsHandler(null));
  };

  const deleteTodo = () => {
    setUpdatingTodosIdsHandler(id);
    setErrorHandler('');

    deleteTodoApi(id)
      .then(() => deleteTodoHandler(id))
      .catch(() => {
        setErrorHandler(UNABLE_TO_DELETE_ERROR);
      })
      .finally(() => setUpdatingTodosIdsHandler(null));
  };

  const setIsEditingModeHandler = (value: boolean) => {
    setIsEditingMode(value);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onChange={toggleStatus}
          data-cy="TodoStatus"
          type="checkbox"
          className={cn('todo__status', {
            completed,
          })}
          checked={completed}
        />
      </label>

      {isEditingMode ? (
        <EditForm todo={todo} setEditingMode={setIsEditingModeHandler} />
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditingModeHandler(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={deleteTodo}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': updatingTodosIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
