import React from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<boolean>;
  deletingTodoIds: number[];
  isDeletingTodo: boolean;
  updatingTodoIds: number[];
  onUpdateTodo: (todoId: number, changes: Partial<Todo>) => Promise<boolean>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  temporaryTodo,
  onDeleteTodo,
  deletingTodoIds,
  isDeletingTodo,
  updatingTodoIds,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
          onDeleteTodo={onDeleteTodo}
          isDisabled={isDeletingTodo || updatingTodoIds.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          isLoading={true}
          onDeleteTodo={onDeleteTodo}
          isDisabled={true}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
