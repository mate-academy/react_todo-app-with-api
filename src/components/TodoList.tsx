import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';
import { useTodo } from '../Context/TodoContext';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoElement
              todo={todo}
              key={todo.id}
            />
          </CSSTransition>

        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="item"
          >
            <TodoElement
              todo={tempTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
