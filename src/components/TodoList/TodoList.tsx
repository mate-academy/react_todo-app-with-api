import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Error } from '../../types/Error';

interface Props {
  todos: Todo[];
  loaderTodoId: number[] | null;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  TodoUpdate: (todo: Todo) => void;
  setErrorText: (error: Error) => void;
  setLoaderTodoId: (todosId: number[] | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  TodoUpdate,
  setErrorText,
  loaderTodoId,
  setLoaderTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={250} classNames="item">
            <TodoItem
              todo={todo}
              loaderTodoId={loaderTodoId}
              TodoUpdate={TodoUpdate}
              setErrorText={setErrorText}
              setLoaderTodoId={setLoaderTodoId}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={250} classNames="item">
            <TodoItem
              todo={tempTodo}
              loaderTodoId={[tempTodo.id]}
              TodoUpdate={TodoUpdate}
              setLoaderTodoId={setLoaderTodoId}
              setErrorText={setErrorText}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
