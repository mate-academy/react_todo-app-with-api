import React from 'react';
import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  onEdit: (todo: Todo, newTitle: string) => Promise<void>;
  inProcess: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onEdit,
  onToggle,
  inProcess,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
          isDefaultLoading={inProcess.includes(todo.id)}
        />
      ))}
    </section>
  );
};
