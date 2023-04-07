import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorsMessages } from '../../types/ErrorsMessages';
import { TodoItemLoader } from '../TodoItemLoader';

type Props = {
  todos: Todo[],
  onCheck: (id: number, data: Partial<Todo>) => void,
  removeTodo: (id: number) => void,
  processings: number[],
  errorMessage: (message: ErrorsMessages) => void,
  tempTodo: Todo | null,
};

export const Main: React.FC<Props> = ({
  todos,
  onCheck,
  removeTodo,
  processings,
  errorMessage,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              onCheck={onCheck}
              removeTodo={removeTodo}
              processings={processings}
              errorMessage={errorMessage}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItemLoader todoTitle={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
