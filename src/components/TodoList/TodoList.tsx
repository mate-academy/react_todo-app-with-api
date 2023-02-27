import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  handleUpdateTodo: (
    todoId: number,
    value: boolean | string,
  ) => void,
  isProcessedIds: number[],
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDeleteTodo,
  tempTodo,
  handleUpdateTodo,
  isProcessedIds,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            handleUpdateTodo={handleUpdateTodo}
            isProcessedIds={isProcessedIds}
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
            handleDeleteTodo={() => {}}
            handleUpdateTodo={() => {}}
            isProcessedIds={isProcessedIds}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
