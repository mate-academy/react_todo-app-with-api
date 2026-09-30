import React from 'react';
import { Todo, TodoUpdate } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, changes: TodoUpdate) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDelete,
  onUpdate,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingTodoIds.includes(todo.id)}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    ))}
  </>
);
