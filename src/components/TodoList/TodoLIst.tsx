import React from 'react';
import classNames from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (arg: number) => void;
  removingTodoId: number;
  updatedTodoId: number[];
  changeTodoDetails: (todoId: number, data: UpdateTodoArgs) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  removingTodoId,
  updatedTodoId,
  changeTodoDetails,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          removeTodo={removeTodo}
          removingTodoId={removingTodoId}
          changeTodoDetails={changeTodoDetails}
          updatedTodoId={updatedTodoId}
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
              checked
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
