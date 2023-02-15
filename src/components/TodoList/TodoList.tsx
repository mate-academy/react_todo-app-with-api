import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isBeingAdded: boolean,
  onRemove: (todoId: number) => void,
  onUpdate: (todo: Todo, props: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isBeingAdded,
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
          isBeingAdded={isBeingAdded}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onRemove={onRemove}
          onUpdate={() => {}}
          isBeingAdded={isBeingAdded}
        />
      )}
    </section>
  );
};
