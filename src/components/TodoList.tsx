import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  activeLoaderIds: number[];
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  activeLoaderIds,
  onDeleteTodo,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDeleteTodo}
        onUpdate={onUpdateTodo}
        isLoading={activeLoaderIds.includes(todo.id)}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isLoading />}
  </section>
);
