import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  isAdding: boolean,
  onRemove: (id: number) => Promise<void>,
  activeTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  isAdding,
  onRemove,
  activeTodoIds,
}) => (

  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            key={todo.id}
            onRemove={onRemove}
            activeTodoIds={activeTodoIds}
          />
        </CSSTransition>
      ))}

      {isAdding && tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoInfo
            todo={tempTodo}
            key={tempTodo.id}
            onRemove={onRemove}
            activeTodoIds={activeTodoIds}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
