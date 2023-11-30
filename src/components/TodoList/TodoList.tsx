import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useTodoContext } from '../../TodoContext';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
}) => {
  const {
    tempTodo,
  } = useTodoContext();

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
