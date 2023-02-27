import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (id: number) => Promise<void>
  changeTodos: (todo: Todo, title?: string) => Promise<void>
  isWaiting: boolean

};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  changeTodos,
  isWaiting,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        changeTodos={changeTodos}
        isWaiting={isWaiting}
      />
    ))}

    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          {tempTodo!.title}
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
