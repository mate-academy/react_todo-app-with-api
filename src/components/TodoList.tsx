import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (
    todo: Todo,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingIds.includes(todo.id)}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        isLoading
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    )}
  </section>
);
