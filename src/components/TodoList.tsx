import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from '../TodoItems';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  onDelete: (id: number) => void;
  updatingIds: number[];
  onToggle: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  onDelete,
  updatingIds,
  onToggle,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingIds.includes(todo.id) || updatingIds.includes(todo.id)
          }
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
        />
      )}
    </section>
  );
};
