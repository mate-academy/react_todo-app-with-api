import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';

interface Props {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  completedIds: number[];
  isLoading: boolean;
  updateTodo: (
    todoId: number,
    data: UpdateTodoArgs,
  ) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
  completedIds,
  isLoading,
  updateTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          completedIds={completedIds}
          updateTodo={updateTodo}
          loadingIds={loadingIds}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && (
        <div
          className={cn('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div
            className={cn('modal', 'overlay', {
              'is-active': isLoading,
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
