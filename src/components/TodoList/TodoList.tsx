import React from 'react';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../utils/useTodosContext';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useTodosContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames={'item'}>
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
