import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/Errors';
import { getChangedTodo } from '../../utils/getChangedTodo';
import { EditTodoTitle } from '../EditTodoTitle/EditTodoTitle';
import { TodoOmited } from '../../types/TodoOmited';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number[]) => Promise<void[]>;
  onErrorMessageChange: (error: Errors) => void;
  onUpdateTodo: (todosToUpdate: TodoOmited[]) => Promise<void[]>;
  pendingTodosId: number[];
}

export const TodoBody: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  pendingTodosId,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  function handleChangeTodo<T>(
    callback: (todosToUpdate: T) => Promise<void[]>,
    valueToCall: T,
  ): void {
    if (valueToCall) {
      callback(valueToCall).finally();
    }
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          onChange={() => {
            handleChangeTodo(onUpdateTodo, [
              getChangedTodo(todo, 'completed', !todo.completed),
            ]);
          }}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleChangeTodo(onDeleteTodo, [todo.id]);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <EditTodoTitle
          handleChangeTodo={handleChangeTodo}
          todo={todo}
          setIsEditing={setIsEditing}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || pendingTodosId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
