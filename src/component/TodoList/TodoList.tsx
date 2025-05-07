import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todosIsLoading: number[];
  removeTodo: (todoId: number[]) => void;
  updateStatusTodo: (todo: Todo[]) => void;
  // setError: (error: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosIsLoading,
  removeTodo,
  updateStatusTodo,
  // setError,
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
          // setError={setError}
        />
      ))}
    </section>
  );
};
