import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosAfterFilter: Todo[],
  handleDeletingTodo: (id: number) => void,
  tempTodo: Todo | null,
  todosForTemp: number[]
  handleUpdatingTodo: (id: number, data: null | string) => void,
};

export const TodoList: React.FC<Props> = ({
  todosAfterFilter,
  handleDeletingTodo,
  tempTodo,
  todosForTemp,
  handleUpdatingTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {
          todosAfterFilter
            .map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  handleDeletingTodo={handleDeletingTodo}
                  tempTodo={tempTodo}
                  todosForTemp={todosForTemp}
                  handleUpdatingTodo={handleUpdatingTodo}
                />
              </CSSTransition>
            ))
        }

        {tempTodo?.id === 0 && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
              handleDeletingTodo={handleDeletingTodo}
              tempTodo={tempTodo}
              todosForTemp={todosForTemp}
              handleUpdatingTodo={handleUpdatingTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
