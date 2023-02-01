import React, { memo, useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo?: (todoId: number) => Promise<void>;
  isDeleted?: boolean;
  onChangeTodo?: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>;
};

export const TodosItem: React.FC<Props> = memo(({
  todo,
  onDeleteTodo = () => {},
  isDeleted,
  onChangeTodo = () => {},
}) => {
  const todoTitleField = useRef<HTMLInputElement>(null);

  const [isTodoChanged, setIsTodoChanged] = useState(false);
  const [temporaryTitle, setTemporaryTitle] = useState(todo.title);

  const setTitleChange = () => {
    if (!temporaryTitle) {
      onDeleteTodo(todo.id);
      setIsTodoChanged(false);

      return;
    }

    if (todo.title !== temporaryTitle) {
      onChangeTodo(todo.id, { title: temporaryTitle });
    }

    setIsTodoChanged(false);
  };

  const setKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsTodoChanged(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsTodoChanged(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onChangeTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      {isTodoChanged
        ? (
          <form onSubmit={setTitleChange}>
            <input
              data-cy="TodoTitleField"
              ref={todoTitleField}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={temporaryTitle}
              onChange={(event) => setTemporaryTitle(event.target.value)}
              onBlur={setTitleChange}
              onKeyDown={setKeyDown}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isDeleted || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
