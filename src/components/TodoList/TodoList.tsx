import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  remove: (id: number) => void,
  tempTodo: Todo | null,
  isConnection: boolean,
  todosLoading: number[];
  todosUpdate: (id: number, data: Partial<Todo>) => void;
  removeTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  remove,
  tempTodo,
  isConnection,
  todosLoading,
  todosUpdate,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={remove}
              todosLoading={todosLoading}
              todosUpdate={todosUpdate}
              removeTodo={removeTodo}
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
              onDelete={remove}
              todosLoading={todosLoading}
              todosUpdate={todosUpdate}
              removeTodo={removeTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
