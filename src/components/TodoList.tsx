import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  query: string,
  tempTodo: Todo | null,
  toggleTodo: (id: number) => void,
  setTemptTodo: (tempTodo: Todo | null) => void,
  setTodos: (todos: Todo[]) => void,
  setError: (error: Error | null) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  query,
  tempTodo,
  toggleTodo,
  setTemptTodo,
  setTodos,
  setError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          toggleTodo={toggleTodo}
          setTemptTodo={setTemptTodo}
          setTodos={setTodos}
          setError={() => setError}
          todos={todos}
        />
      ))}

      {/* This todo is being edited */}
      {false && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" aria-label="status">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" aria-label="status">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {query}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
