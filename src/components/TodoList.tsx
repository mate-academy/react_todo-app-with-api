import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { getFilteredTodos } from '../utils/getFilteredTodos';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(TodoContext);

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        <TransitionGroup>
          {filteredTodos.map(todo => (
            <CSSTransition key={todo.id} timeout={500} classNames="item">
              <TodoItem todo={todo} />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition key={0} timeout={500} classNames="temp-item">
              <TempTodo />
            </CSSTransition>
          )}
        </TransitionGroup>
      </ul>
    </section>
  );
};
