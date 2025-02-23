import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  renderedList: Todo[];
  tempTodo: Todo | null;
  idsToDelete: number[] | null;
  onError: (error: Error) => void;
  resetIdsToDelete: (todoIds: number[]) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (todo: Todo) => Promise<void>;
  idsForStatusChange: number[];
}

export const TodoList: React.FC<Props> = ({
  renderedList,
  tempTodo,
  onError,
  idsToDelete,
  resetIdsToDelete,
  handleDelete,
  handleUpdate,
  idsForStatusChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {renderedList.map(({ id, title, completed, userId }) => (
          <CSSTransition key={id} timeout={300} classNames="item">
            <TodoItem
              title={title}
              status={completed}
              id={id}
              onError={onError}
              userId={userId}
              idsToDelete={idsToDelete}
              resetIdsToDelete={resetIdsToDelete}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              idsForStatusChange={idsForStatusChange}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  value={tempTodo.title}
                  aria-label="Todo input field"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', { 'is-active': true })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
