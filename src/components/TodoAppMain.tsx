/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';
import { TodoInfo } from './TodoInfo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../styles/animation.scss';
import { TempTodo } from './TempTodo';
import { Select } from '../types/Todo';

export const TodoAppMain: React.FC = () => {
  const { todoApi, fetch, addItem, select, totalLength } =
    useContext(StateContext);

  const filtered = (s: Select) => {
    switch (s) {
      case Select.All:
        return totalLength;

      case Select.Active:
        return totalLength.filter(todo => !todo.completed);

      case Select.Completed:
        return totalLength.filter(todo => todo.completed);

      default:
        return todoApi;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filtered(select).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo todo={todo} />
          </CSSTransition>
        ))}
        {fetch && addItem && (
          <CSSTransition key="loader" timeout={300} classNames="item">
            <TempTodo />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
