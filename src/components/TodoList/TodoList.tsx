import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  handleToggleTodo: (todo: Todo) => void;
  editingTodoId: number | null;
  handleEditSubmit: (e: React.FormEvent) => void;
  editTitleRef: React.RefObject<HTMLInputElement>;
  editingTodoTitle: string;
  handleEditingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditCancel: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  updatingTodoIds: number[];
  handleEditing: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  addingTodoId: number | null;
  deletingTodoIds: number[];
};

const TodoListComponent: React.FC<Props> = ({
  visibleTodos,
  handleToggleTodo,
  editingTodoId,
  handleEditSubmit,
  editTitleRef,
  editingTodoTitle,
  handleEditingChange,
  handleEditCancel,
  updatingTodoIds,
  handleEditing,
  handleDeleteTodo,
  addingTodoId,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo)}
            />
          </label>

          {editingTodoId === todo.id ? (
            <form onSubmit={handleEditSubmit}>
              <input
                ref={editTitleRef}
                type="text"
                className="todo__title-field"
                data-cy="TodoTitleField"
                value={editingTodoTitle}
                onChange={handleEditingChange}
                onBlur={handleEditSubmit}
                onKeyDown={handleEditCancel}
                disabled={updatingTodoIds.includes(todo.id)}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditing(todo)}
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
            className={classNames('modal overlay', {
              'is-active':
                todo.id === addingTodoId ||
                updatingTodoIds.includes(todo.id) ||
                deletingTodoIds.includes(todo.id),
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

export const TodoList = React.memo(TodoListComponent);
