// TodoList.jsx
import React from 'react';
import cn from 'classnames';
import { TodoListProps } from './types/TodoListProps';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  deleteTodo,
  isSubmitting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
            disabled={isSubmitting}
          >
            ×
          </button>
          {isSubmitting && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={cn('todo',
            { completed: tempTodo.completed, 'is-active': tempTodo })}
        >
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          {tempTodo && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
