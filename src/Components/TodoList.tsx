// eslint-disable-next-line import/no-extraneous-dependencies
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodoData } from '../hooks/useTodoData';

export const TodoList: React.FC = () => {
  const { filteredTodos, loadingIds, tempTodo } = useTodoData();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup component={null}>
        {filteredTodos.map(todo => {
          const isLoading = loadingIds.includes(todo.id);

          return (
            <CSSTransition
              key={`todo-${todo.id}`}
              timeout={300}
              classNames="item"
              appear={true}
            >
              <TodoItem todo={todo} isLoading={isLoading} />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key="temp" timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
