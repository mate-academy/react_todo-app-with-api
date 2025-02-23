import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  loading: number[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorNotification: (error: string) => void;
  setLoading: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  tempTodo,
  handleDeleteTodo,
  setTodos,
  setErrorNotification,
  setLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              loading={loading}
              handleDeleteTodo={handleDeleteTodo}
              setTodos={setTodos}
              setErrorNotification={setErrorNotification}
              setLoading={setLoading}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loading={loading}
              handleDeleteTodo={handleDeleteTodo}
              setTodos={setTodos}
              setErrorNotification={setErrorNotification}
              setLoading={setLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
