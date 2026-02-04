import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  processingIds: number[];
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  onDelete,
  onUpdate,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={processingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onUpdate={onUpdate}
          onRename={newTitle => onRename(todo, newTitle)}
        />
      ))}
    </section>
  );
};
