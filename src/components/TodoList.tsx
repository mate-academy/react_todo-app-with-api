import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  processingIds: number[];
  onUpdate: (id: number, data: { title?: string; completed?: boolean }) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingIds,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isProcessing={processingIds.includes(todo.id)}
        onUpdate={onUpdate}
      />
    ))}
  </section>
);
