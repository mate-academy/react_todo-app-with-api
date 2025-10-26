import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
  onDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => (
          <CSSTransition key={todo.id} timeout={100} classNames="item">
            <TodoItem
              todo={todo}
              isLoading={loadingTodoIds.includes(todo.id)}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key="temp-todo" timeout={100} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={loadingTodoIds.includes(tempTodo.id)}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
