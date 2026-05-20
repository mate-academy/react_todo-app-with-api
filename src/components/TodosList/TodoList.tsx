import { createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoViewModel } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoViewModel[];
  tempTodo: TodoViewModel | null;
  handleDelete: (id: number) => void;
  handleUpdateTodo: (
    id: number,
    completed: boolean,
    title: string,
  ) => Promise<void>;
};

export function TodoList({
  todos,
  handleDelete,
  tempTodo,
  handleUpdateTodo,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup component={null}>
        {todos.map(todo => {
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
                  onDelete={handleDelete}
                  onUpdateTodo={handleUpdateTodo}
                />
              </div>
            </CSSTransition>
          );
        })}

        {tempTodo &&
          (() => {
            const nodeRef = createRef<HTMLDivElement>();

            return (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
                nodeRef={nodeRef}
              >
                <div ref={nodeRef}>
                  <TodoItem
                    todo={tempTodo}
                    onUpdateTodo={handleUpdateTodo}
                    onDelete={handleDelete}
                  />
                </div>
              </CSSTransition>
            );
          })()}
      </TransitionGroup>
    </section>
  );
}
