import React from 'react';
import { Todo } from '../types/Todo';
import { TContext, useTodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const {
    tempTodos,
  } = useTodoContext() as TContext;

  if (tempTodos !== null) {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {[...todos, tempTodos].map((todo: Todo) => {
          return (
            <TodoItem todo={todo} key={todo?.id} />
          );
        })}
      </section>
    );
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem todo={todo} key={todo?.id} />
        );
      })}
    </section>
  );
};
