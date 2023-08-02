import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[],
  tempTodo:Todo | null;
  isLoading:boolean;
  loadingTodods:number[];
  onDeleteTodo:(value:number) => Promise<void>;
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDeleteTodo,
  tempTodo,
  isLoading,
  onUpdateTodo,
  loadingTodods,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={3000}
            classNames="item"
          >
            <TodoItem
              deleteTodo={onDeleteTodo}
              todo={todo}
              loadingId={loadingTodods}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={3000}
            classNames="temp-item"
          >

            <TodoItem
              todo={tempTodo}
              isLoading={isLoading}
              onUpdateTodo={async () => {}}
            />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
