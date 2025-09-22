import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  loadingTodoId: number[];
  tempTodo?: Todo | null;
  onDelete: (todoId: number) => void;
  onUpdate?: (todoId: number, update: Partial<Omit<Todo, 'id'>>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  loadingTodoId,
  tempTodo,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          loadingTodoId={loadingTodoId}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
          loadingTodoId={loadingTodoId}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
