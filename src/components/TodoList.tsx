import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onUpdate: (
    todoId: number,
    dataToUpdate: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onUpdate,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={() => {}}
          onUpdate={() => Promise.resolve()}
          isLoading
        />
      )}
    </section>
  );
};
