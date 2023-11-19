import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (value: number) => void;
  tempTodo: Todo | null;
  isLoading: number[];
  handleUpdateTodo: (value: Todo) => void;
};

export const List: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  handleUpdateTodo,
  isLoading,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={todo}
        key={todo.id}
        todos={todos}
        handleUpdateTodo={handleUpdateTodo}
        isLoading={isLoading.includes(todo.id)}
        // isLoading={isLoading}
      />
    ))}

    {tempTodo && (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={tempTodo}
        key={tempTodo.id}
        todos={todos}
        handleUpdateTodo={handleUpdateTodo}
        isLoading={isLoading.includes(tempTodo.userId)}
        // isLoading={isLoading}
      />
    )}
  </section>
);
