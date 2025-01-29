import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  preparedTodos: Todo[];
  onRemoveTodo: (id: number) => Promise<boolean>;
  loading: number[];
  tempTodo: Todo | null | undefined;
  onUpdateTodo: (todo: Todo) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  loading,
  onRemoveTodo,
  tempTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {preparedTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdateTodo={onUpdateTodo}
              onRemoveTodo={onRemoveTodo}
              isLoading={loading.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              onUpdateTodo={onUpdateTodo}
              onRemoveTodo={onRemoveTodo}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
