import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processedIds: number[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  title: string;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processedIds,
  onDelete,
  onStatusChange,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isProcessed={processedIds.includes(todo.id)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessed
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
