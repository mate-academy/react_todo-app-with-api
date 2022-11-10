import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoContext } from '../TodoContext';
import { FilterContext } from '../FilterContext';
import { TodoItem } from './TodoItem';

export const VisibleTodos: React.FC = () => {
  const { todos } = useContext(TodoContext);
  const { filterTodo } = useContext(FilterContext);

  return (
    <TransitionGroup>
      {todos
        .filter(todo => filterTodo(todo))
        .map(todo => {
          const { id } = todo;

          return (
            <CSSTransition
              className="item"
              timeout={300}
              key={id}
            >
              <TodoItem
                key={id}
                todo={todo}
              />
            </CSSTransition>
          );
        })}
    </TransitionGroup>
  );
};
