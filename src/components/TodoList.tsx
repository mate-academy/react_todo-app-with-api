import React from 'react';
import type { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  pendingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number, nextCompleted: boolean) => Promise<void> | void;
  onRename: (id: number, newTitle: string) => Promise<void> | void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  pendingIds,
  onDelete,
  onToggle,
  onRename,
}) => {
  const list = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(todo => {
        const isTemp = todo.id === 0;
        const isPending = isTemp || pendingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isPending={isPending}
            onDelete={onDelete}
            onToggle={onToggle}
            onRename={onRename}
          />
        );
      })}
    </section>
  );
};
