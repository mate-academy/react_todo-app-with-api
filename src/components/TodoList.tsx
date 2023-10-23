import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  updateTodo: (todoId: number, args: UpdateTodoArgs) => Promise<void>
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          removeTodo={removeTodo}
          todo={tempTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
