import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isActiveLoaderTodos: number[];
  onDeleteTodo: (id: number) => Promise<void>;
  onToggleTodo: (id: number, completed: boolean) => Promise<void>;
  onChangeTodo: (id: number, title: string) => Promise<void>;
};

const TRANSTION_DURATION = 300;

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isActiveLoaderTodos,
  onDeleteTodo,
  onToggleTodo,
  onChangeTodo,
}) => {
  function isActiveLoaderTodo(id: number): boolean {
    return isActiveLoaderTodos.includes(id);
  }

  return (
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          in={!!todo.id}
          appear
          unmountOnExit
          timeout={TRANSTION_DURATION}
          classNames="todo"
        >
          <TodoItem
            todo={todo}
            hasLoader={isActiveLoaderTodo(todo.id)}
            onDeleteTodo={onDeleteTodo}
            onToggleTodo={onToggleTodo}
            onChangeTodo={onChangeTodo}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          timeout={TRANSTION_DURATION}
          classNames="todo-temp"
        >
          <TodoItem
            todo={tempTodo}
            hasLoader
            onDeleteTodo={onDeleteTodo}
            onToggleTodo={onToggleTodo}
            onChangeTodo={onChangeTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
