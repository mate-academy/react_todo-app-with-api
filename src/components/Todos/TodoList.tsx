import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  deleteTodoToState: (todoId: number) => void;
  changeTodoFromState: (todoId: number, title?: string) => void;
  changeError: (value: ErrorTypes | null) => void;
  todosInProcess: number[] | null;
}

const TodoList: React.FC<Props> = (
  {
    todos,
    isAdding,
    deleteTodoToState,
    changeTodoFromState,
    changeError,
    todosInProcess,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {isAdding && (
          <CSSTransition
            timeout={1}
            // classNames="item-load"
          >
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Create todo...
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodoToState={deleteTodoToState}
              changeTodoFromState={changeTodoFromState}
              changeError={changeError}
              todosInProcess={todosInProcess}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;
