/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { createRef, useRef } from 'react';
import { Todo, TodoChanges } from '../../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  onRemoveTodo: (todoId: number) => void;
  onUpdateTodo: (todoId: number, changes: TodoChanges) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
};

export const TodoList = ({
  onRemoveTodo,
  onUpdateTodo,
  visibleTodos,
  tempTodo,
  loadingTodoIds,
}: Props) => {
  const tempNodeRef = useRef<HTMLDivElement>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup component={null}>
        {visibleTodos.map(todo => {
          const nodeRef = createRef<HTMLDivElement>();

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              nodeRef={nodeRef}
            >
              <div ref={nodeRef}>
                <TodoItem
                  todo={todo}
                  isLoading={loadingTodoIds.includes(todo.id)}
                  onRemove={onRemoveTodo}
                  onUpdate={onUpdateTodo}
                />
              </div>
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            nodeRef={tempNodeRef}
          >
            <div ref={tempNodeRef}>
              <TodoItem todo={tempTodo} isLoading={true} />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
