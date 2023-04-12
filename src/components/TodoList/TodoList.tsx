import React from 'react';
import { TodoItem } from '../TodoItem';

import { TodoRich } from '../../types/TodoRich';
import { TodoRichEditable } from '../../types/TodoRichEditable';

type Props = {
  todos: TodoRich[];
  tempTodo: TodoRich | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (todoId: number, updatedData: TodoRichEditable)
  => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoUpdate,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onTodoDelete={onTodoDelete}
        onTodoUpdate={onTodoUpdate}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
      />
    )}
  </section>
);
