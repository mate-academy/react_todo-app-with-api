import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

const TEMP_TODO_ID = 0;

interface Props {
  visibleTodos: Todo[];
  tempTodo?: Todo | null;
  loadingTodoIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, dataQuery: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  loadingTodoIds,
  tempTodo,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={loadingTodoIds.includes(todo.id)}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={TEMP_TODO_ID}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={TEMP_TODO_ID}
              todo={tempTodo}
              isLoading={true}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
