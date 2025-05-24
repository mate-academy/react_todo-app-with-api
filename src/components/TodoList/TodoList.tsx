import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  formText: string;
  focusedTodo: Todo | null;
  todos: Todo[];
  currentTodos: Todo[];
  showTempTodo: boolean;
  errorMessage: string;
  setTodos: (todos: Todo[]) => void;
  setFocusedTodo: (todo: Todo | null) => void;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  formText,
  focusedTodo,
  todos,
  currentTodos,
  showTempTodo,
  errorMessage,
  inputRef,
  setFocusedTodo,
  setTodos,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {currentTodos.map(todo => {
        const { id } = todo;

        return (
          <TodoInfo
            setFocusedTodo={setFocusedTodo}
            focusedTodo={focusedTodo}
            todo={todo}
            todos={todos}
            errorMessage={errorMessage}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            inputRef={inputRef}
            key={id}
          />
        );
      })}

      {showTempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
            {''}
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {formText}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
