import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  idUpdating: number[];
  handleUpdate: (
    id: number,
    data: { completed?: boolean, title?: string },
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  idUpdating,
  handleUpdate,
}) => {
  return (

    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              idUpdating={idUpdating}
              handleUpdate={handleUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              removeTodo={removeTodo}
              idUpdating={idUpdating}
              handleUpdate={handleUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
