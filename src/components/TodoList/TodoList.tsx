import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

import './TodoList.scss';
import { useTodosContext } from '../../context/useTodosContext';

export const TodoList:React.FC = () => {
  const { visibleTodos } = useTodosContext();

  return (
    <>
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  );
};
