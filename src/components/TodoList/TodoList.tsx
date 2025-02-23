import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTodos } from '../../TodosContext';

export const TodoList = React.memo(() => {
  const { filteredTodos, tempTodo, isLoading, isSubmitting } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isProcessed={isLoading.includes(todo.id)}
              isSubmitting={isSubmitting}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              isProcessed={isLoading.includes(0)}
              isSubmitting={isSubmitting}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});

TodoList.displayName = 'TodoList';
