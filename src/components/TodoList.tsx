import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void;
  onToggle?: (todo: Todo) => void;
  loadingIds?: number[];
  onRename?: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  loadingIds,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          isLoading={loadingIds?.includes(todo.id)}
          onRename={onRename}
        />
      ))}
    </section>
  );
};
