import React, { memo, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { StateContext } from '../../store/store';
import { useFilteredTodos } from '../../hooks/useFilteredTodos';

export const TodoList:React.FC = memo(() => {
  const { todos, filter, tempTodo } = useContext(StateContext);
  const filteredTodos = useFilteredTodos(todos, filter);

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

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} key={tempTodo.id} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
