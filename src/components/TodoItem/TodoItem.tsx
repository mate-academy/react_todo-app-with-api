import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
  handleUpdateTodo: (todoId: number, updatedData: {}) => void;
  setIsTtitleChanging: (state: boolean) => void;
};

export const TodoItem = ({
  todo,
  handleDeleteTodo,
  loadingTodos,
  handleUpdateTodo,
  setIsTtitleChanging,
}: Props) => {
  const [isChangeState, setIsChangeState] = useState(false);
  const [updateTodoTitle, setUpdateTodoTitle] = useState(todo.title);
  const input = useRef<HTMLInputElement>(null);
  const isCompleted = todo.completed;
  const trimmedTitle = updateTodoTitle.trim();

  useEffect(() => {
    input.current?.focus();
  });

  const handleTodoDoubleClick = () => {
    setIsChangeState(true);
    setIsTtitleChanging(true);
  };

  const changeTodo = () => {
    if (trimmedTitle === todo.title) {
      setIsChangeState(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);
    } else {
      handleUpdateTodo(todo.id, { title: trimmedTitle });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeTodo();
  };

  const handleInputBlur = () => {
    changeTodo();

    setIsChangeState(false);
  };

  const onEscPush = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsChangeState(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isCompleted })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={String(todo.id)}>
        <input
          id={String(todo.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() =>
            handleUpdateTodo(todo.id, { completed: !isCompleted })
          }
        />
      </label>
      {!isChangeState ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            className="todo__title-field"
            data-cy="TodoTitleField"
            ref={input}
            value={updateTodoTitle}
            onBlur={handleInputBlur}
            onKeyDown={onEscPush}
            onChange={event => setUpdateTodoTitle(event.target.value)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
