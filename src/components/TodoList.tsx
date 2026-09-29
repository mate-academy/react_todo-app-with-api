import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onToggle: (todo: Todo) => Promise<boolean>;
  onRename: (todo: Todo, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onToggle,
  onRename,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={processingIds.includes(todo.id)}
        onDelete={onDelete}
        onToggle={onToggle}
        onRename={onRename}
      />
    ))}
    {tempTodo && <TodoItem todo={tempTodo} isLoading />}
  </section>
);
