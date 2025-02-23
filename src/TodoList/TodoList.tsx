/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
interface TodoListProps {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  fakeTodo: Todo | null;
  loadingTodoId: number[];
  updateTodo: (todo: Todo) => Promise<void>;
  errorMessage: string;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  fakeTodo,
  loadingTodoId,
  updateTodo,
  errorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="temp-item">
            <TodoItem
              onDelete={deleteTodo}
              todo={todo}
              isLoadingTodos={loadingTodoId.includes(todo.id)}
              changeTodo={updateTodo}
              errorMessage={errorMessage}
            />
          </CSSTransition>
        ))}
        {fakeTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              onDelete={deleteTodo}
              todo={fakeTodo}
              isLoadingTodos={loadingTodoId.includes(fakeTodo.id)}
              changeTodo={() => Promise.resolve()}
              errorMessage={errorMessage}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
