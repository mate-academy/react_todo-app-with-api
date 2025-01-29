// import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: number[];
  onDeleteTodo: (value: number) => Promise<void>;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loading,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        <div className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                onDeleteTodo={onDeleteTodo}
                onUpdateTodo={onUpdateTodo}
                isLoading={loading.includes(todo.id)}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempTodo} isLoading />
            </CSSTransition>
          )}
        </div>
      </TransitionGroup>
    </section>
  );
};
