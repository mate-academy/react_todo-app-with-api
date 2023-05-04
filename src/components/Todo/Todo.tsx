import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import { deleteTodos, patchTodos } from '../../api/todos';

type Props = {
  todoItem: TodoType
  todosUpdate: () => void,
  setDeleteError: (errorState: boolean) => void;
  isClearAllCompleted: boolean,
  toggleActive: boolean,
  toggleCompleted: boolean,
};

export const Todo: React.FC<Props>
= React.memo(
  ({
    todoItem,
    todosUpdate,
    setDeleteError,
    isClearAllCompleted,
    toggleActive,
    toggleCompleted,
  }) => {
    const { completed, title, id } = todoItem;

    const [isLoading, setLoading] = useState(false);

    const handleDeleteTodos = (todoId: typeof id) => {
      setLoading(true);

      deleteTodos(todoId)
        .then(() => setLoading(false))
        .catch(() => {
          setDeleteError(true);
        })
        .finally(() => {
          setLoading(false);
          todosUpdate();
        });
    };

    const handeleCompletedStatus
    = (
      todoId: typeof id,
      currCompletedStatus: typeof completed,
    ) => {
      setLoading(true);
      patchTodos(todoId, { completed: !currCompletedStatus })
        .finally(() => {
          setLoading(false);
          todosUpdate();
        });
    };

    return (
      <div
        className={classNames(
          'todo',
          { completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
            onChange={() => handeleCompletedStatus(id, completed)}
          />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodos(id)}
        >
          ×
        </button>

        <div className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading
          || (completed && isClearAllCompleted)
          || (completed && toggleCompleted)
          || (!completed && toggleActive),
          },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
