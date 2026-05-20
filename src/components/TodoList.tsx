import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<boolean>;
  loadingTodoIds: number[];
  onToggle: (todo: Todo) => void;
  onRename: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  onToggle,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodoIds.includes(todo.id)}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
    </section>
  );
};
