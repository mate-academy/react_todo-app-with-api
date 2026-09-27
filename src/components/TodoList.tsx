import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoId: number | null;
  togglingTodoIds: number[];
  renamingTodoId: number | null;
  onDelete: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoId,
  togglingTodoIds,
  renamingTodoId,
  onDelete,
  onToggle,
  onRename,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      const isToggling = togglingTodoIds.includes(todo.id);
      const isDeleting = deletingTodoId === todo.id;
      const isRenaming = renamingTodoId === todo.id;

      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={isDeleting || isToggling || isRenaming}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      );
    })}
  </section>
);
