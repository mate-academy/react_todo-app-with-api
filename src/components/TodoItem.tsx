import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleUpdate: (todo: Todo) => void;
  wantChangeTitle: number;
  setWantChangeTitle: (id: number) => void;
  changeTodoTitle: string;
  setChangeTitle: (arg: string) => void;
  handleKeyChangeTitle: (
    event:React.KeyboardEvent<HTMLInputElement>,
    todo: Todo) =>
  Promise<void>;
  handleRemoveTodo: (id: number) => void;
  activeTodoId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleUpdate,
  wantChangeTitle,
  setWantChangeTitle,
  changeTodoTitle,
  setChangeTitle,
  handleKeyChangeTitle,
  handleRemoveTodo,
  activeTodoId,
}) => {
  const changeTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (changeTodoField.current) {
      changeTodoField.current.focus();
    }
  }, [wantChangeTitle]);

  const handleBlur = () => {
    setWantChangeTitle(-1);
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleUpdate(todo)}
        />
      </label>
      {wantChangeTitle === todo.id
        ? (
          <form onSubmit={event => event.preventDefault()}>
            <input
              data-cy="ChangeTodoField"
              type="text"
              ref={changeTodoField}
              className="todoapp__new-todo"
              placeholder="Empty title will be removed"
              value={changeTodoTitle}
              onChange={(event) => setChangeTitle(
                changeTodoField.current?.value || '',
              )}
              onBlur={handleBlur}
              onKeyDown={event => handleKeyChangeTitle(event, todo)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setWantChangeTitle(todo.id);
                setChangeTitle(todo.title);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleRemoveTodo(todo.id)}
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
          { 'is-active': activeTodoId.includes(todo.id) },
        )}
      >
        <div className="
        modal-background
        has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
