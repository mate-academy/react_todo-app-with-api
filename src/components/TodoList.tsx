import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { preparedTodos, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {preparedTodos?.map(todo => (
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
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              active
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
