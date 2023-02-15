import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AuthContext } from '../Auth/AuthContext';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  onHandleChangeTodo(data: object, id: number): void,
  onDelete: (id: number) => void,
  creating?: boolean,
  processings: number[],
  todos: Todo[],
  title: string,
};

export const TodoList: React.FC<Props> = ({
  onHandleChangeTodo,
  onDelete,
  processings,
  creating,
  todos,
  title,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                isProcessed={processings.includes(todo.id)}
                onDelete={onDelete}
                onHandleChangeTodo={onHandleChangeTodo}
              />
            </CSSTransition>
          ))}

          {creating && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={{
                  id: Math.random(),
                  title,
                  completed: false,
                  userId: user?.id || 0,
                }}
                onHandleChangeTodo={() => {}}
                onDelete={onDelete}
                isProcessed
              />
            </CSSTransition>
          )}
        </TransitionGroup>

      </ul>
    </section>
  );
};
