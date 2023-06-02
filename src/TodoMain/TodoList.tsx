/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo, TodoData } from '../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: TodoData | null;
  removeTodo: (todoId: number) => Promise<void>;
  updateTodoChek: (arg: number, completed: boolean) => Promise<void>;
  updateTodoTitle: (arg: number, title: string) => Promise<void>;
  setIsUpdatingError: (arg: boolean) => void;
  todosForRemove: Todo[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updateTodoChek,
  updateTodoTitle,
  setIsUpdatingError,
  todosForRemove,
}) => {
  const [todoEditingId, setTodoEditingId] = useState<number | null>(null);

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          updateTodoChek={updateTodoChek}
          updateTodoTitle={updateTodoTitle}
          setTodoEditingId={setTodoEditingId}
          todoEditingId={todoEditingId}
          setIsUpdatingError={setIsUpdatingError}
          todosForRemove={todosForRemove}
        />
      ))}
      {tempTodo && (
        <div
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
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
          <button type="button" className="todo__remove">×</button>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
