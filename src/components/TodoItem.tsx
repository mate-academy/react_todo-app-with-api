import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoEdit } from './TodoEdit';

type Props = {
  todo: Todo;
  handleToggleTodo: (id: number) => void;
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadingIds: number[];
  isBeingEdited: Todo | null;
  setIsBeingEdited: Dispatch<SetStateAction<null | Todo>>;
  onUpdateTodo: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleToggleTodo,
  loadingIds,
  onDeleteTodo,
  isBeingEdited,
  setIsBeingEdited,
  onUpdateTodo,
  setLoadingIds,
}) => {
  const { completed, id, title } = todo;
  const handleDelete = (todoId: number) => {
    return onDeleteTodo(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      onDoubleClick={() => setIsBeingEdited(todo)}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodo(id)}
        />
      </label>

      {isBeingEdited === todo ? (
        <TodoEdit
          todo={todo}
          setIsBeingEdited={setIsBeingEdited}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          setLoadingIds={setLoadingIds}
        />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
