import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo, UpdateTodoframent } from '../types/Todo';
import { StateContext } from './StateContext';
import { useHideError, useShowError } from '../utils/hooks';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: UpdateTodoframent) => void;
}

export const TodoItem: React.FC<Props> = (props) => {
  const { todo, onDelete, onUpdate } = props;

  const { isSavingTodo } = useContext(StateContext);

  const [isLoading, setIsLoading] = useState(isSavingTodo);
  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  const [updatingTitle, setUpdatingTitle] = useState('');

  const updateTodoField = useRef<HTMLInputElement>(null);

  const showError = useShowError();

  const hideError = useHideError();

  const handleDelete = (todoId: number) => {
    setIsLoading(true);
    hideError();

    deleteTodo(todoId)
      .then(res => {
        if (!res) {
          throw Error();
        }

        onDelete(todoId);
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleUpdate = (todoId: number, data: UpdateTodoframent) => {
    setIsLoading(true);
    hideError();

    updateTodo(todoId, data)
      .then(res => {
        if (!res) {
          throw Error();
        }

        onUpdate(todoId, data);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const checkBeforeUpdate = () => {
    if (updatingTitle.length === 0) {
      handleDelete(todo.id);

      return;
    }

    if (updatingTitle !== todo.title) {
      handleUpdate(todo.id, { title: updatingTitle });
    }

    setIsTitleUpdating(false);
    setUpdatingTitle('');
  };

  const cancelUpdate = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsTitleUpdating(false);
      setUpdatingTitle('');
    }
  };

  useEffect(() => {
    if (isTitleUpdating) {
      setUpdatingTitle(todo.title);
    }

    if (updateTodoField.current) {
      updateTodoField.current.focus();
    }
  }, [isTitleUpdating]);

  useEffect(() => {
    setIsLoading(isSavingTodo);
  }, [isSavingTodo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsTitleUpdating(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => handleUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isTitleUpdating ? (
        <form onSubmit={(event) => {
          event.preventDefault();
          checkBeforeUpdate();
        }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatingTitle}
            onChange={(event) => setUpdatingTitle(event.target.value)}
            onBlur={checkBeforeUpdate}
            ref={updateTodoField}
            onKeyDown={cancelUpdate}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
