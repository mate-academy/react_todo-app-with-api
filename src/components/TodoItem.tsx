import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  removeOneTodo: (id: number) => void;
  hasUpdateError: () => void;
  isRemoving: boolean;
  isRemovingAll: boolean;
};

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const {
    todo,
    removeOneTodo,
    hasUpdateError,
    isRemoving,
    isRemovingAll,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [deletedItem, setDeletedItem] = useState(0);

  const updateOneTodo = (item: Todo) => {
    setIsLoading(true);
    client.patch<Todo>(`/todos/${item.id}`, {
      completed: !item.completed,
    })
      .catch(hasUpdateError)
      .finally(() => setIsLoading(false));
  };

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
          onClick={() => updateOneTodo(todo)}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
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

      {((isLoading
        || (isRemoving && deletedItem === todo.id))
        || (isRemovingAll && todo.completed))
        && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
});
