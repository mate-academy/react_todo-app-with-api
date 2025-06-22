import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoListProps {
  filteredTodos: Todo[];
  handleToggle: (id: number) => void;
  handleEditClick: (id: number) => void;
  deleteTodo: (id: number) => void;
  isEdited: boolean;
  editingId: number | null;
  newTitle: string;
  setNewTitle: (title: string) => void;
  handleBlurOrKeyDown: (
    e:
    | React.KeyboardEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement>,
    id: number,
  ) => void;
  todoInOperation: number[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  handleToggle,
  handleEditClick,
  deleteTodo,
  isEdited,
  editingId,
  newTitle,
  setNewTitle,
  handleBlurOrKeyDown,
  todoInOperation,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
          </label>

          {isEdited && editingId === todo.id ? (
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={e => handleBlurOrKeyDown(e, todo.id)}
              onKeyDown={e => handleBlurOrKeyDown(e, todo.id)}
              autoFocus
              ref={inputRef}
            />
          ) : (
            <>
              <span
                className="todo__title"
                data-cy="TodoTitle"
                onDoubleClick={() => handleEditClick(todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': todoInOperation.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
