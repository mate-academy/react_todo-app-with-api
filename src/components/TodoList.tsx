import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle?: (id: number, status: boolean) => void;
  onDoubleClick: (todo: Todo | null) => void;
  deletingIds: Set<number>;
  togglingIds: Set<number>;
  updatingIds: Set<number>;
  selectedTodo: Todo | null;
  onUpdate: (id: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  togglingIds,
  updatingIds,
  onToggle = () => {},
  onDoubleClick = () => {},
  selectedTodo = null,
  onUpdate = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isDeleting={deletingIds.has(todo.id)}
          isToggling={togglingIds.has(todo.id)}
          isUpdating={updatingIds.has(todo.id)}
          onToggle={onToggle}
          onDoubleClick={onDoubleClick}
          selectedTodo={selectedTodo}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
