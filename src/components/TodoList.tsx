import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  onRename: (id: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onStatusChange,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessing
          onDelete={() => {}}
          onStatusChange={() => {}}
          onRename={() => Promise.resolve()}
        />
      )}
    </section>
  );
};
