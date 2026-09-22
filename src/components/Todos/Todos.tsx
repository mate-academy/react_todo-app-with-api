import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todoToCreate: Todo | null;
  refEditing: React.Ref<HTMLInputElement>;
  todoToEdit: Todo | null;
  checkTodoProcessing: (id: number) => boolean;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteClick: (id: number) => void;
  onEditClick: (id: number) => void;
  onEditSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  onEditCancel: () => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  todoToCreate,
  refEditing,
  todoToEdit,
  checkTodoProcessing,
  onToggleComplete,
  onDeleteClick,
  onEditClick,
  onEditSubmit,
  onEditCancel,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, completed, title }) => {
        return (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => onToggleComplete(id, completed)}
              />{' '}
            </label>

            {todoToEdit?.id === id ? (
              <form onSubmit={onEditSubmit}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  ref={refEditing}
                  onBlur={() => onEditSubmit()}
                  onKeyUp={event => {
                    if (event.key === 'Escape') {
                      onEditCancel();
                    }
                  }}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    onEditClick(id);
                  }}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDeleteClick(id)}
                >
                  ×
                </button>
              </>
            )}

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal', 'overlay', {
                'is-active': checkTodoProcessing(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {/* This todo is in loadind state */}
      {todoToCreate && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />{' '}
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todoToCreate.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          {/* * 'is-active' class puts this modal on top of the todo * */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
