import React from 'react';
import { Todo, TodoForChange } from './types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[]
  removeTodo: (todoIduserId: number) => void;
  loadingTodos: number[];
  updateTodoInfo: (todoId: number, newInfo: TodoForChange) => void;
}

export const Todolist: React.FC<Props> = ({
  todos,
  removeTodo,
  loadingTodos,
  updateTodoInfo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          loadingTodos={loadingTodos}
          updateTodoInfo={updateTodoInfo}
        />
      ))}
    </section>
  );
};
