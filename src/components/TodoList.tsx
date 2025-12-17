import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingIds: number[];
  onToggle: (todo: Todo) => Promise<void>;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingIds,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isDeleting={deletingIds.includes(todo.id)}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          isDeleting={false}
          onToggle={async () => {}}
          onRename={async () => {}}
        />
      )}
    </section>
  );
};
