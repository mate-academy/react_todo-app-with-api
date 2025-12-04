import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

type Props = {
  todos: TodoType[];
  loadingIds?: Set<number>;
  onDelete?: (id: number) => void;
  onToggle?: (id: number, nextCompleted: boolean) => void;
  onUpdateTitle?: (id: number, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={loadingIds?.has(todo.id) ?? false}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </section>
  );
};
