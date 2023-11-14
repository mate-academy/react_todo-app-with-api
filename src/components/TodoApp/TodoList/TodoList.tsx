import React, { useContext, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { StateContext } from '../../../TodoStore';
import { TodoItem } from '../TodoItem';
import { Filter } from '../../../types/Filter';
import { Todo } from '../../../types/Todo';

export const TodoList: React.FC = () => {
  const { initialTodos, tempTodo, selectedFilter } = useContext(StateContext);

  const visibleTodos = useMemo<Todo[]>(() => {
    return initialTodos.filter(todo => {
      switch (selectedFilter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    });
  }, [initialTodos, selectedFilter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
