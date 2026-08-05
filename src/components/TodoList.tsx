import React from 'react';
import { Todo, TodoUpdate } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processedTodoIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todoId: number, data: TodoUpdate) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processedTodoIds,
  onDelete,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isProcessed={processedTodoIds.includes(todo.id)}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isProcessed />}
  </section>
);
