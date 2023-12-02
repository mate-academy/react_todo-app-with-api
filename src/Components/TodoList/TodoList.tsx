import React from 'react';
import cn from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setFocusedInput: (arg: boolean) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  USER_ID: number;
};

export const TodoList: React.FC<Props> = React.memo((({
  filteredTodos,
  tempTodo,
  setFocusedInput,
  todos,
  setTodos,
  setErrorMessage,
  USER_ID,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          USER_ID={USER_ID}
          setFocusedInput={setFocusedInput}
        />
      ))}

      {tempTodo !== null && (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed,
          })}

        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
}));
