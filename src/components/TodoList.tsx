import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';

interface Props {
  todos: TodoType[];
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onToggle,
  onRename,
  loadingIds
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo 
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          isLoading={loadingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
