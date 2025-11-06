import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  loading: boolean;
  processingIds: number[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: Todo['id'], todoStatus: Todo['completed']) => void;
  onEditTodo: (id: Todo['id'], newTitle: string) => void;
  creating: boolean;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  processingIds,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
  creating,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading && <div className="loader is-overlay" data-cy="TodoLoader" />}
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              loading={processingIds.includes(todo.id)}
              processingIds={processingIds}
              onDelete={() => onDeleteTodo(todo.id)}
              onToggle={onToggleTodo}
              onEdit={onEditTodo}
            />
          </CSSTransition>
        ))}
        {creating && tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={creating}
              processingIds={processingIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
