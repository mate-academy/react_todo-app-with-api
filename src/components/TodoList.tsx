import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isLoading: (todoId: Todo['id']) => boolean;
  onDelete: (todoId: Todo['id']) => Promise<unknown>;
  onToggleStatus: (todoId: Todo['id']) => void;
  onSaveTitle: (todoId: Todo['id'], newTitle: string) => Promise<unknown>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  onDelete,
  onToggleStatus,
  onSaveTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading(todo.id)}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onSaveTitle={onSaveTitle}
        />
      ))}
    </section>
  );
};
