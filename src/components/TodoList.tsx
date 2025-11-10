import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  loadingTodoIds?: number[];
  onDelete?: (todoId: number) => void;
  onToggle?: (todoId: number, completed: boolean) => void;
  onUpdate?: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds = [],
  onDelete,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
