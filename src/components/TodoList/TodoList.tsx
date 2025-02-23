import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import { Todo } from '../../types';

import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: number[];
  isSubmitting: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  isSubmitting,
  onDelete,
  onUpdate,
}) => {
  const transitionTimeout = 300;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={transitionTimeout}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              isSubmitting={isSubmitting}
              isLoading={isLoading.includes(todo.id)}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={uuidv4()}
            timeout={transitionTimeout}
            classNames="item"
          >
            <TodoItem
              key={uuidv4()}
              todo={tempTodo}
              isLoading={isLoading.includes(0)}
              isSubmitting={isSubmitting}
              onDelete={() => {}}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
