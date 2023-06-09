import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  isConnection: boolean,
  todosLoading: number[],
  todosUpdate: (id: number, data: Partial<Todo>) => void,
  deleteTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  isConnection,
  todosLoading,
  todosUpdate,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              todosLoading={todosLoading}
              todosUpdate={todosUpdate}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && isConnection && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              todosLoading={todosLoading}
              todosUpdate={todosUpdate}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
