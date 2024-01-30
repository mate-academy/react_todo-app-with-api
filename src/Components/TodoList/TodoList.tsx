import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  updateTodo: (updatedTodo: Todo) => Promise<void>
  loadingTodosId: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  loadingTodosId,
  tempTodo,
}) => {
  return (
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            loader={loadingTodosId.includes(todo.id)}
          />
        </CSSTransition>
      ))}

      {tempTodo !== null && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            updateTodo={updateTodo}
            loader={loadingTodosId.includes(tempTodo.id)}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
