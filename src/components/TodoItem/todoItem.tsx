import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  RefObject,
  KeyboardEvent,
} from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  waitForResponseToggleTodo: boolean;
  toggleTodoCompleted: (id: number) => void;
  isProcessed: boolean;
  handleDelete: (todoId: number) => void;
  waitingDelete: boolean;
  todoWaitDeleteId: number | null;
  inputRef: RefObject<HTMLInputElement>;
  toggleTodoId: number | null;
  waitForToggle: boolean;
  handleDoubleClick: (todoId: number) => void;
  handleTodoTitleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateFormNeeded: boolean;
  handleTitleChangeSubmit: (
    event: FormEvent<HTMLFormElement> | null,
    todoId: number,
  ) => void;
  activeChangeTodoId: number | null;
  loadingChangeTodoTitle: boolean;
  loadingChangeTodoTitleId: number | null;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  waitForResponseToggleTodo,
  toggleTodoCompleted,
  isProcessed,
  handleDelete,
  waitingDelete,
  todoWaitDeleteId,
  inputRef,
  toggleTodoId,
  waitForToggle,
  handleDoubleClick,
  handleTodoTitleInputChange,
  updateFormNeeded,
  handleTitleChangeSubmit,
  activeChangeTodoId,
  loadingChangeTodoTitle,
  loadingChangeTodoTitleId,
  handleKeyDown,
}) => {
  const preventDelete = (
    event: MouseEvent<HTMLButtonElement>,
    todoId: number,
  ) => {
    event.preventDefault();

    handleDelete(todoId);

    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const handleToggleTodo = (todoId: number) => toggleTodoCompleted(todoId);

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        'is-active': waitForResponseToggleTodo,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          className="todo__status"
          onChange={() => handleToggleTodo(todo.id)}
        />
      </label>

      {updateFormNeeded && activeChangeTodoId === todo.id ? (
        <form onSubmit={event => handleTitleChangeSubmit(event, todo.id)}>
          <input
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={event => handleTodoTitleInputChange(event)}
            onBlur={() => handleTitleChangeSubmit(null, todo.id)}
            onKeyDown={event => handleKeyDown(event)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={event => preventDelete(event, todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            waitForToggle ||
            (loadingChangeTodoTitle && todo.id === loadingChangeTodoTitleId) ||
            (isProcessed && todo.id === 0) ||
            (todo.id === todoWaitDeleteId && waitingDelete) ||
            (todo.id === toggleTodoId && waitForResponseToggleTodo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
