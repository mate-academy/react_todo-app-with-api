import React from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';

import TodoInfo from '../TodoInfo/TodoInfo';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTodo: (id: number, data: any) => Promise<void>;
  loadingTodo: number[];
};

const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  removeTodo,
  updateTodo,
  loadingTodo,
}) => (
  <ul>
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            isNewTodo={false}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
            loadingTodo={loadingTodo}
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
            isNewTodo
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </ul>
);

export default TodoList;
