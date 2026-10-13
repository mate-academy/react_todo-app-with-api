import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: Set<number>;
  updatingTodoIds: Set<number>;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo, completed: boolean) => void;
  onRename: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  updatingTodoIds,
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
          isLoading={
            deletingTodoIds.has(todo.id) || updatingTodoIds.has(todo.id)
          }
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
        />
      ))}
    </section>
  );
};
