import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { Notifications } from '../types/Notifications';

interface Props {
  todos: Todo[],
  setNotification: (value: Notifications) => void,
  isAdding: boolean,
  title: string,
  removeTodo: (id: number) => void,
  togleStatus: (
    id: number,
    completed: boolean,
    isLoading: (value: boolean) => void) => void,
  activeTodosIds: number[],
}

export const TodoList:React.FC<Props> = ({
  todos,
  setNotification,
  isAdding,
  title,
  removeTodo,
  togleStatus,
  activeTodosIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo: Todo) => (
      <TodoInfo
        todo={todo}
        setNotification={setNotification}
        key={todo.id}
        togleStatus={togleStatus}
        removeTodo={removeTodo}
        activeTodosIds={activeTodosIds}
      />
    ))}

    {isAdding && (
      <div
        data-cy="Todo"
        className="todo"
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
