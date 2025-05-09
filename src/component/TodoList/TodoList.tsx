import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todosIsLoading: number[];
  removeTodo: (todoId: number[], isInUpdate: boolean) => void;
  updateStatusTodo: (todo: Todo[]) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosIsLoading,
  removeTodo,
  updateStatusTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateStatusTodo={updateStatusTodo}
          isLoading={todosIsLoading.includes(todo.id)}
        />
      ))}
    </section>
  );
};
