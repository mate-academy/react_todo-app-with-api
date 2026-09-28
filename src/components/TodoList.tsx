import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  // Updated signatures to match App.tsx (Checklist Item 10)
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onRename: (id: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <ul className="todo-list" data-cy="TodoList">
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            isProcessing={processingIds.includes(todo.id)}
            onDelete={onDelete}
            onToggle={onToggle}
            onRename={onRename}
          />
        </li>
      ))}

      {tempTodo && (
        <li>
          <TodoItem
            todo={tempTodo}
            isProcessing={true}
            onDelete={onDelete}
            onToggle={onToggle}
            onRename={onRename}
          />
        </li>
      )}
    </ul>
  );
};
