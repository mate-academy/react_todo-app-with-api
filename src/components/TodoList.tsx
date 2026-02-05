import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  onToggle: (id: number) => void;
  processingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onUpdate,
  onToggle,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggle={onToggle}
          isLoading={processingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
