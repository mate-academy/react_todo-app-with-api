/* eslint-disable object-curly-newline */
import React, { useContext } from 'react';
import classNames from 'classnames';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { TodoContext } from '../contexts/TodoContext';
import { Filtering } from '../types/Filtering';

export const TodoList: React.FC = () => {
  // eslint-disable-next-line max-len
  const { todos, filtering, tempTodo } = useContext(TodoContext);

  const visibleTodos = (currentFiltering: Filtering) => {
    switch (currentFiltering) {
      case Filtering.ALL:
        return todos;
      case Filtering.ACTIVE:
        return todos.filter((t) => !t.completed);
      case Filtering.COMPLETED:
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* <TransitionGroup> */}
      {visibleTodos(filtering).map((todo) => (
        // <CSSTransition
        //   key={todo.id}
        //   timeout={300}
        //   classNames="item"
        // >
        <TodoItem todo={todo} key={todo.id} />
        // </CSSTransition>
      ))}
      {/* </TransitionGroup> */}

      {/* <TransitionGroup>
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        > */}
      {tempTodo && (
        <div data-cy="Todo" className={classNames('todo')}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', 'is-active')}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
      {/* </CSSTransition> */}
      {/* </TransitionGroup> */}
    </section>
  );
};
