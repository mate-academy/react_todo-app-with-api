import React, { PropsWithChildren, ReactElement } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';

import './TodoList.scss';

interface Props extends PropsWithChildren {
  todos: Todo[];
  children: ReactElement[];
}

export const TodoList: React.FC<Props> = ({ todos, children }) => {
  return (
    <section className="TodoList" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo, index) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            {children[index]}
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
