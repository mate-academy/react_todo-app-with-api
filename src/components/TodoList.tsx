import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface ListProps {
  todos: Todo[];
  tempTodo: Todo | undefined;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
  todoLoading: boolean;
  loadingIds: Set<number>;
}

export const TodoList: React.FC<ListProps> = ({
  todos,
  tempTodo,
  onDelete,
  onToggle,
  onUpdate,
  todoLoading,
  loadingIds,
}) => (
  <>
    {todos.map((todo: Todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
          isLoading={loadingIds.has(todo.id)}
        />
      );
    })}

    {tempTodo && todoLoading && (
      <TodoItem
        key="temp-todo"
        todo={tempTodo}
        isLoading={todoLoading}
        onDelete={onDelete}
        onToggle={onToggle}
        onUpdate={onUpdate}
      />
    )}
  </>
);
