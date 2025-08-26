import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  editingTodoId: number | null;
  todoToChange: number[];
  handleEditTodo: (id: number) => void;
  handleFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
    oldTitle: string,
  ) => void;
  handleSaveTodo: (id: number, newTitle: string, oldTitle: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  editingTodoId,
  todoToChange,
  handleEditTodo,
  handleFormSubmit,
  handleSaveTodo,
  handleEditKeyDown,
  handleUpdateTodo,
  deleteTodo,
  editInputRef,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        aria-label="Toggle todo status"
        className="todo__status"
        checked={todo.completed}
        onChange={() =>
          handleUpdateTodo(todo.id, { completed: !todo.completed })
        }
        disabled={todoToChange.includes(todo.id) || todo.id === 0}
      />
    </label>
    {editingTodoId === todo.id ? (
      <form onSubmit={e => handleFormSubmit(e, todo.id, todo.title)}>
        <input
          ref={editInputRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          defaultValue={todo.title}
          autoFocus
          onBlur={e => handleSaveTodo(todo.id, e.target.value, todo.title)}
          onKeyDown={handleEditKeyDown}
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEditTodo(todo.id)}
        >
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
          disabled={todoToChange.includes(todo.id) || todo.id === 0}
        >
          ×
        </button>
      </>
    )}
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': todoToChange.includes(todo.id) || todo.id === 0,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
