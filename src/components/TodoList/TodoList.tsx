import React from 'react';
import { TodoItem } from '../TodoItem';

import { TodoRich } from '../../types/TodoRich';
import { TodoRichEditable } from '../../types/TodoRichEditable';

type Props = {
  todos: TodoRich[];
  tempTodo: TodoRich | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoToggle: (todoId: number, isCompleted: boolean) => Promise<void>;
  onTodoUpdate: (todoId: number, updatedData: TodoRichEditable) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
  onTodoUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
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
};
