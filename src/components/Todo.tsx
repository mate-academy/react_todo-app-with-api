/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  todoId: number;
  formActive: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  idsToUptdated: number[];
  handleChangeCompleted: (todoSelect: TodoType) => void;
  handleBlur: (todoSelect: TodoType) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: TodoType,
  ) => void;
  handleSetFormActive: (title: string, id: number) => void;
  handleDeleteTodo: (id: number) => void;
};

function Todo({
  todo,
  todoId,
  formActive,
  inputRef,
  todoTitle,
  setTodoTitle,
  idsToUptdated,
  handleChangeCompleted,
  handleBlur,
  handleKeyDown,
  handleSetFormActive,
  handleDeleteTodo,
}: Props) {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${todo.id === 0 ? 'temp' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleChangeCompleted(todo)}
          checked={todo.completed}
        />
      </label>

      {formActive && todo.id === todoId ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={inputRef}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={e => setTodoTitle(e.target.value)}
            onBlur={() => handleBlur(todo)}
            onKeyDown={e => handleKeyDown(e, todo)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleSetFormActive(todo.title, todo.id)}
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
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 || idsToUptdated.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}

export default Todo;
