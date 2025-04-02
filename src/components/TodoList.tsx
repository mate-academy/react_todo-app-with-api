import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  loading: boolean;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => Promise<boolean>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  loadingIds,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo
              todo={todo}
              loading={loading}
              loadingIds={loadingIds}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
              key={todo.id}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
