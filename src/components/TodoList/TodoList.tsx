import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  onUpdate: (todo: Todo) => void,
  isLoading: number[],
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading={isLoading.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading={isLoading.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
