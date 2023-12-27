import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null;
  todoIds: number[];
  onClick: (todo: Todo) => void;
  updateTitle: (todo: Todo, title: string) => void;
};

export const TodosList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  tempTodo,
  todoIds,
  onClick,
  updateTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            todoIds={todoIds}
            onClick={onClick}
            updateTitle={updateTitle}
            key={todo.id}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            todoIds={todoIds}
            onClick={onClick}
            key={tempTodo.id}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
