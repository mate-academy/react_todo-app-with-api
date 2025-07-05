import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  onToggle: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  loadingIds,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingIds.includes(todo.id)}
          isTemporary={false}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          isLoading={true}
          isTemporary={true}
          onToggle={() => {}}
          onUpdate={() => Promise.resolve(true)}
        />
      )}
    </section>
  );
};
