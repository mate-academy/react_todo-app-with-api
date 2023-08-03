import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void,
  onUpdateTodo: (todoId: number, args: Partial<Todo>) => void,
  processingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
  processingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          processing={processingIds.includes(todo.id)}
          onDeleteTodo={onDeleteTodo}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          processing
        />
      )}
    </section>
  );
};
