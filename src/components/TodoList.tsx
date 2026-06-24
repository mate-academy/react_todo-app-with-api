import React from 'react';
import { Todo } from '../types/Types';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  onRename: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  processingIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
