import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { NewTodo } from '../NewTodo/NewTodo';

type Props = {
  todo: Todo;
  loader: boolean;
  focusedTodoId: number;
  togglerLoader: boolean;
  clearCompletedLoader: boolean;
  onDeleteTodo: (value: number) => void;
  onUpdateTodo: (todoId: number, todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  loader,
  clearCompletedLoader,
  togglerLoader,
  focusedTodoId,
}) => {
  const [isTitleModifying, setIsTitleModifying] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleModifying]);

  const handleDeleteButton = () => {
    onDeleteTodo(todo.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleStatusChange = async (todo: Todo) => {
    onUpdateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label
        className="todo__status-label"
        onChange={() => handleStatusChange(todo)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {!isTitleModifying && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsTitleModifying(true);
              newTodoField.current?.focus();
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteButton()}
          >
            ×
          </button>
        </>
      )}

      {isTitleModifying && (
        <NewTodo
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          currentTodo={todo}
          title={todo.title}
          onTitleModifyingChange={setIsTitleModifying}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': (loader && focusedTodoId === todo.id)
              || togglerLoader || clearCompletedLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
