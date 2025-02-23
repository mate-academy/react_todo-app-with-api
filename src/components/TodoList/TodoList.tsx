import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  sortedArray: Todo[];
  loadingTodo: Todo | null;
  setErrorMessage: (el: string) => void;
  setIsDeleting: (el: boolean) => void;
  deletingListId: number[];
  setTodos: (todosOrCallback: Todo[] | ((todos: Todo[]) => Todo[])) => void;
  todos: Todo[];
  focusInput: () => void;
  activateTodosId: number[];
};

export const TodoList: React.FC<Props> = ({
  sortedArray,
  loadingTodo,
  setErrorMessage,
  setIsDeleting,
  deletingListId,
  setTodos,
  todos,
  focusInput,
  activateTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedArray.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setIsDeleting={setIsDeleting}
          deletingListId={deletingListId}
          todos={todos}
          focusInput={focusInput}
          activateTodosId={activateTodosId}
        />
      ))}
      {loadingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor={`tempTodoStatus`}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id={`tempTodoStatus`}
              aria-label={`Mark as ${loadingTodo.completed ? 'incomplete' : 'complete'}`}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {loadingTodo.title}
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
};
