import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => Promise<number>,
  updateTodo: (updatedTodo: Todo) => Promise<Todo>,
  loadingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  loadingTodoIds,
}) => (
  <ul className="todo-list">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        loadingTodoIds={loadingTodoIds}
      />
    ))}

    {tempTodo && (
      <li
        className={classNames('todo', {
          completed: tempTodo.completed,
        })}
      >
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">
          {tempTodo.title}
        </span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay is-active">
          <div className="modal-background" />
          <div className="loader" />
        </div>
      </li>
    )}
  </ul>
);
