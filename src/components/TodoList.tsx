import React from 'react';
import type { Todo } from '../types/Todo';
import Task from './Task';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
  onToggle: (todoId: number) => Promise<void>;
  toggleIds: number[];
  onRename: (todoId: number, newTitle: string) => Promise<void>;
};

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  deletingTodoIds,
  toggleIds,
  onRename,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(task => (
        <Task
          key={task.id}
          todo={task}
          onDelete={() => onDelete(task.id)}
          isLoading={deletingTodoIds.includes(task.id)}
          onToggle={onToggle}
          toggleIds={toggleIds}
          onRename={onRename}
        />
      ))}
    </section>
  );
}
