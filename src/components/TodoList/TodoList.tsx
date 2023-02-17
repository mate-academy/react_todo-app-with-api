/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TemporaryTodo } from '../TemporaryTodo/TemporaryTodo';

type Props = {
  removeTodo: (todoId: number) => void,
  tempTodo: unknown,
  todoTitle: string,
  todos: Todo[],
  processingTodoIds: number[],
  toggleClick: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  removeTodo,
  tempTodo,
  todoTitle,
  todos,
  processingTodoIds,
  toggleClick,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        todo.completed ? (
          <div key={todo.id} className="todo completed">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
                checked
                onClick={() => toggleClick(todo)}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(todo.id)}
            >
              x
            </button>

            <div className={classNames(
              'modal overlay',
              { 'is-active': processingTodoIds.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ) : (
          <div key={todo.id} className="todo">
            <label className="todo__status-label">
              <input
                title="status"
                type="checkbox"
                className="todo__status"
                onClick={() => toggleClick(todo)}
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(todo.id)}
            >
              x
            </button>

            <div className={classNames(
              'modal overlay',
              { 'is-active': processingTodoIds.includes(todo.id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )
      ))}

      {tempTodo !== null && <TemporaryTodo title={todoTitle} />}
    </section>
  );
};
