import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: boolean;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  deleteTodo: (id: number) => Promise<boolean>;
  toggleCompletedField: (id: number) => Promise<void> | undefined;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loading,
  deletingTodoIds,
  updatingTodoIds,
  deleteTodo,
  toggleCompletedField,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              loading={
                deletingTodoIds.includes(todo.id) ||
                updatingTodoIds.includes(todo.id)
              }
              deleteTodo={deleteTodo}
              toggleCompletedField={toggleCompletedField}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={loading}
              deleteTodo={deleteTodo}
              toggleCompletedField={toggleCompletedField}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
