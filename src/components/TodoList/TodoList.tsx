import React, { useContext } from 'react';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { TodosContext } from '../../contexts/TodosContext';
import {CSSTransition, TransitionGroup} from "react-transition-group";

export const TodoList: React.FC = () => {
  const { tempTodo, visibleTodos } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
          >
            <TodoListItem todo={todo}/>
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
              key={tempTodo.id}
              timeout={300}
              classNames="item"
          >
            <TodoListItem todo={tempTodo}/>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
