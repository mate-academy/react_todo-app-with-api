import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
  onCompleteTodo: (todoId: number) => Promise<void>
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  deleteTodo,
  onCompleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          onCompleteTodo={onCompleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          onCompleteTodo={onCompleteTodo}
        />
      )}
    </section>
  );
};
