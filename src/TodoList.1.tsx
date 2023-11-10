import React from 'react';
import cn from 'classnames';
import { TodoListProps } from './types/TodoListProps';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  deleteTodo,
  loadingTodo,
  toggleTodoStatus,
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
              checked={todo.completed}
              onChange={() => toggleTodoStatus(todo.id)}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
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
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay',
              { 'is-active': loadingTodo === todo.id })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={cn('todo', { completed: tempTodo.completed })}
        >
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', { 'is-active': tempTodo })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
