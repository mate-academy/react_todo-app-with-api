/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  setTodos: (array: Todo[]) => void;
  removeTodo: (todo: Todo) => void;
  markCompleted: (todo: Todo) => void;
  changeTitle: (todo: Todo, title: string) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  markCompleted,
  changeTitle,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              markCompleted={markCompleted}
              removeTodo={removeTodo}
              changeTitle={changeTitle}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
