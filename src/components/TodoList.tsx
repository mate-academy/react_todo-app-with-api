import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onStatusChange: (id: number, completed: boolean) => Promise<void>;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onStatusChange,
  onUpdateTitle,
  tempTodo,
  loadingTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onUpdateTitle={onUpdateTitle}
            isLoading={loadingTodos.includes(todo.id)}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isLoading />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
