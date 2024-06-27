/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { ListProps } from '../../types/Todo';

export const TodoList: React.FC<ListProps> = ({
  visibleTodos,
  handleTodoStatusChange,
  handleDeleteTodo,
  loadingTodoIds,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleTodoStatusChange={handleTodoStatusChange}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => handleTodoStatusChange(tempTodo.id)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(tempTodo.id)}
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
