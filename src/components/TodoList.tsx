import React from 'react';
import { Todo } from '../types/Todo';
import { TodoChanges } from '../api/todos';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, changes: TodoChanges) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  onDelete,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={processingIds.includes(todo.id)}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key="temporary-todo"
        todo={tempTodo}
        isLoading
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    )}
  </section>
);
