import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isAdding: boolean,
  newTodoTitle: string,
};

export const TodoList = React.memo(
  ({
    todos, isAdding, newTodoTitle,
  }: Props) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                isAdding={false}
              />
            </CSSTransition>
          ))}
          {isAdding && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={{
                  id: 0,
                  userId: 0,
                  title: newTodoTitle,
                  completed: false,
                }}
                isAdding={isAdding}
              />
            </CSSTransition>
          )}
        </TransitionGroup>

      </section>
    );
  },
);
