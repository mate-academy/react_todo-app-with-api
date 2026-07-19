import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (id: number, newTitle: string) => Promise<void>;
  tempTodo?: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  onDelete,
  onToggle,
  onRename,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={processingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isProcessing={true}
          onDelete={() => {}}
          onToggle={() => {}}
          onRename={() => Promise.resolve()}
        />
      )}
    </section>
  );
};
