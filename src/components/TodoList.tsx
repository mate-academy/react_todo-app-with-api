import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onRename: (id: number, newTitle: string) => Promise<void>;
  processingIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onRename,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          isProcessing={processingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          onRename={() => Promise.resolve()}
          isProcessing={true}
        />
      )}
    </section>
  );
};
