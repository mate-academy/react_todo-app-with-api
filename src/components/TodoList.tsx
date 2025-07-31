import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingIds: number[];
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  updateTodo: (id: number, data: Partial<Todo>) => void;
  showError?: (m: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  deleteTodo,
  tempTodo,
  updateTodo,
  showError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={loadingIds.includes(todo.id)}
          showError={showError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={true}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
