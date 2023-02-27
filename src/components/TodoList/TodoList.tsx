import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todoitem/Todoitem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onRemove: (todoId: number) => void,
  onUpdate: (todo: Todo, props: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  onRemove,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemove={onRemove}
          onUpdate={(props) => onUpdate(todo, props)}
          isBeingLoading={!!todo.isLoading}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemove={onRemove}
          onUpdate={() => {}}
          isBeingLoading={!!tempTodo.isLoading}
        />
      )}
    </section>
  );
});
