import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  processedId: number[];
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  onDelete,
  onUpdate,
  processedId,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          processedId={processedId}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} onUpdate={onUpdate} />}
    </section>
  );
});
