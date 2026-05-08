import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingId: number[];
  loadingId: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onRename: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingId,
  loadingId,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          isDeleting={deletingId.includes(todo.id)}
          isLoading={loadingId.includes(todo.id)}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
