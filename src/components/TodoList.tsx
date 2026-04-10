import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  loadingTodoId: number | null;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  loadingTodoIds,
  tempTodo,
  handleDeleteTodo,
  changeCompleted,
  handleChangeTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoId={loadingTodoId}
          loadingTodoIds={loadingTodoIds}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
          handleChangeTitle={handleChangeTitle}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            {/* eslint-disable-line jsx-a11y/label-has-associated-control */}
            <input
              id={`todo-status-${tempTodo.id}`}
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

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loadingTodoId === tempTodo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
