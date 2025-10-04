import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loadingTodos: Record<string | number, boolean>;
  tempTodo: Todo | null;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loadingTodos,
  tempTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            isLoading={loadingTodos[todo.id]}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key="temp-todo" timeout={300} classNames="item">
          <TodoItem
            todo={tempTodo}
            isLoading={true}
            toggleTodo={() => {}}
            deleteTodo={() => {}}
            updateTodo={() => Promise.resolve()}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
