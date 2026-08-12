import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: (value: string) => void;
  startEditing: (todo: Todo) => void;
  cancelEditing: () => void;
  saveEditing: (todo: Todo) => void;
  changeTodoStatus: (id: number, completed: boolean) => void;
  removeTodo: (id: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  startEditing,
  cancelEditing,
  saveEditing,
  changeTodoStatus,
  removeTodo,
  editInputRef,
}) => {
  const isEscPressed = React.useRef(false);

  const handleEditSubmit = (event: React.FormEvent, todo: Todo) => {
    event.preventDefault();
    saveEditing(todo);
  };

  const onBlur = (todo: Todo) => {
    if (!isEscPressed.current) {
      saveEditing(todo);
    }

    isEscPressed.current = false;
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      isEscPressed.current = true;
      cancelEditing();
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                deletingTodoIds.includes(todo.id) ||
                updatingTodoIds.includes(todo.id),
            })}
          >
            <div
              className={classNames(
                'modal-background',
                'has-background-white-ter',
              )}
            />

            <div className="loader" />
          </div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
            <input
              id={`todo-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => changeTodoStatus(todo.id, !todo.completed)}
            />
          </label>

          {editingTodoId === todo.id ? (
            <form onSubmit={event => handleEditSubmit(event, todo)}>
              <input
                ref={editInputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editingTitle}
                onChange={event => setEditingTitle(event.target.value)}
                onBlur={() => onBlur(todo)}
                onKeyUp={onKeyUp}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => startEditing(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => removeTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label" htmlFor="todo-temp">
            <input
              id="todo-temp"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
        </div>
      )}
    </section>
  );
};
