import React from 'react';

import { TodoItem } from '../../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onRemoveTodo: (todoId: number) => void
  onCheckedTodo: (todoId: number) => void
  tempTodoId: number | null
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onCheckedTodo,
  tempTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          onCheckedTodo={onCheckedTodo}
          loading={todo.id === tempTodoId}
        />
      ))}
    </section>
  );
};
