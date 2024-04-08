import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';
import { useTodos } from '../../utils/hooks';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: TodoType[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo, activeTodos } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <Todo
                todo={todo}
                key={todo.id}
                isActive={activeTodos.includes(todo)}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      {tempTodo && <Todo todo={tempTodo} key={tempTodo.id} isActive />}
    </section>
  );
};
