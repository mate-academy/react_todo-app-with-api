import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { useTodos } from '../../TodosContext';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodos } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} key={todo.id} />
          </CSSTransition>
        ))}

        {tempTodos[0]?.id === 0 && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodos[0]} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
