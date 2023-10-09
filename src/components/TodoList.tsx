import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  updateTodo: (todoId: number, args: Partial<Todo>) => Promise<void>,
  deleteTodo: (todoId: number) => Promise<void>,
  loadingIds: number[],
  tempTodo: Todo | null,
  filteredTodos: Todo[],
};

export const TodoList: React.FC<Props> = ({
  updateTodo,
  deleteTodo,
  loadingIds,
  tempTodo,
  filteredTodos,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          loadingIds={loadingIds}
        />
      ))}
      {tempTodo
        && (
          <TodoItem
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            loadingIds={loadingIds}
            todo={tempTodo}
          />
        )}
    </section>
  );
};
