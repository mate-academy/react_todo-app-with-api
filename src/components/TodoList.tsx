import React from 'react';
import { Todo, TodoChangeOptions } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TRANSITION_DURATION } from '../constants';

interface Props {
  todos: Todo[];
  onUpdate: (id: number, changes: TodoChangeOptions) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  processingIds: number[];
  tempTodo?: Partial<Todo> | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onUpdate,
  onDelete,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={TRANSITION_DURATION}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isLoading={processingIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={TRANSITION_DURATION}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo as Todo}
              onDelete={() => Promise.resolve()}
              isLoading={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
