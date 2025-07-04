import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  tempTodo: Todo | null;
  onDelete: (id: number) => Promise<void>;
  loadingTodoId: number[];
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodoId.includes(todo.id)}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          onDelete={onDelete}
          isLoading={true}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </section>
  );
};
