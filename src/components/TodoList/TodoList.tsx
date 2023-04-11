import React from 'react';
import { TodoRich } from '../../types/TodoRich';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoRich[];
  tempTodo: TodoRich | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoToggle: (todoId: number, isCompleted: boolean) => Promise<void>;
  onTodoEditingStateChange: (todoId: number, IsEditing: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
  onTodoEditingStateChange,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
          onTodoEditingStateChange={onTodoEditingStateChange}
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
